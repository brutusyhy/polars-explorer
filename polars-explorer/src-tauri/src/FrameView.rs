use crate::LazyFrame::{get_cols, get_rows};
use crate::Payload::{PageInfo, QueryInfo, ViewResponse};
use polars::prelude::{IdxSize, LazyFrame};
use serde::Serialize;

#[derive(Clone)]
pub(crate) struct ColumnInfo {
    pub(crate) name: usize,
    pub(crate) column_type: String,
}

#[derive(Clone, Serialize)]
pub(crate) struct DataViewInfo {
    pub(crate) key: usize,
    pub(crate) name: String,
    pub(crate) rows: usize,
    pub(crate) cols: usize,
    pub(crate) queryInfo: QueryInfo,
    // For now, it looks like there's no need to cache column info
    // Since transmitted payload will always contain column info
    // pub(crate) cols_info: Vec<ColumnInfo>
}

pub(crate) struct FrameView {
    pub(crate) frame: LazyFrame,          // A LazyFrame with queued queries
    pub(crate) info: DataViewInfo, // We expect each FrameView to be immutable
    pub(crate) page_info: PageInfo,

}

impl FrameView {
    // Create a base FrameView for a LoadedFrame
    pub(crate) fn new(key: usize, name: String, frame: LazyFrame, pageSize: usize) -> Self {
        let rows = get_rows(frame.clone()).unwrap();
        let cols = get_cols(frame.clone()).unwrap();
        let queryInfo = QueryInfo { plan: frame.describe_plan().unwrap() };
        let info = DataViewInfo {
            key,
            name,
            rows,
            cols,
            queryInfo,
        };
        let totalPage = rows.div_ceil(pageSize);
        let page_info = PageInfo {
            pageSize,
            currentPage: 0,
            totalPage,
        };

        Self {
            frame,
            info,
            page_info,
        }
    }

    pub(crate) fn base(name: String, frame: LazyFrame) -> Self {
        // Conveniently get the base view of a lazyframe
        Self::new(0, "Base".to_string(), frame, 20)
    }

    pub(crate) fn turn_page(&mut self, page: usize) -> &mut FrameView {
        // Turn the view to a given page
        let pageSize = self.page_info.pageSize;
        let totalPage = self.page_info.totalPage;
        let page_info = PageInfo {
            pageSize,
            currentPage: page,
            totalPage,
        };
        self.page_info = page_info;
        self
    }

    pub(crate) fn rename(&mut self, name: String) -> &mut FrameView {
        let oldInfo = self.info.clone();
        let info = DataViewInfo {
            name,
            ..oldInfo
        };
        self.info = info;
        self
    }

    // Serialize the view and get a paged response
    pub(crate) fn query(&self) -> ViewResponse {
        let pageInfo = self.page_info.clone();
        let page = pageInfo.currentPage;
        let page_size = pageInfo.pageSize;
        let df = self.frame.clone()
            .slice((page * page_size) as i64, page_size as IdxSize)
            .collect().unwrap();
        let data = serde_json::to_value(&df).unwrap();
        let viewInfo = self.info.clone();

        ViewResponse {
            data,
            pageInfo,
            viewInfo,
        }
    }
}
