use crate::Payload::{DataFrameInfo, DataInfo, DataJSON, PageInfo, QueryInfo, ViewResponse};
use crate::LazyFrame::{get_cols, get_rows};
use polars::prelude::{IdxSize, LazyFrame};
use serde::Serialize;
use std::sync::Mutex;

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
    pub(crate) info: Mutex<DataViewInfo>, // We expect each FrameView to be immutable
    pub(crate) page_info: Mutex<PageInfo>,

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
        let plan = frame.describe_plan().unwrap();

        Self {
            frame,
            info: Mutex::new(info),
            page_info: Mutex::new(page_info),
        }
    }

    pub(crate) fn base(name: String, frame: LazyFrame) -> Self {
        // Conveniently get the base view of a lazyframe
        Self::new(0, "Base".to_string(), frame, 20)
    }

    pub(crate) fn to_page(&mut self, page: usize) -> &mut FrameView {
        // Turn the view to a given page
        let pageSize = self.page_info.lock().unwrap().pageSize;
        let totalPage = self.page_info.lock().unwrap().totalPage;
        let page_info = PageInfo {
            pageSize,
            currentPage: page,
            totalPage,
        };
        *self.page_info.lock().unwrap() = page_info;
        self
    }

    // Serialize the view and get a paged response
    pub(crate) fn query(&self) -> ViewResponse {
        let pageInfo = self.page_info.lock().unwrap().clone();
        let page = pageInfo.currentPage;
        let page_size = pageInfo.pageSize;
        let df = self.frame.clone()
            .slice((page * page_size) as i64, page_size as IdxSize)
            .collect().unwrap();
        let data = serde_json::to_value(&df).unwrap();
        let viewInfo = self.info.lock().unwrap().clone();

        ViewResponse {
            data,
            pageInfo,
            viewInfo,
        }
    }
}
