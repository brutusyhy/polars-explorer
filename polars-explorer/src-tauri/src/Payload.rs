use crate::Channels::{DataChannel, InfoChannel, PageChannel};
use crate::FrameView::DataViewInfo;
use serde::Serialize;

pub type DataJSON = serde_json::Value;

#[derive(Clone, Serialize)]
pub struct PageInfo {
    pub pageSize: usize,
    pub currentPage: usize,
    pub totalPage: usize,
}

#[derive(Clone, Serialize, Debug)]
pub struct DataFrameInfo {
    pub key: usize,
    pub name: String,
}

pub struct ViewResponse {
    pub data: DataJSON,
    pub pageInfo: PageInfo,
    pub viewInfo: DataViewInfo,
}

#[derive(Clone, Serialize)]
pub struct QueryInfo {
    pub plan: String,
}

#[derive(Clone, Serialize)]
pub struct DataInfo {
    pub frameInfo: DataFrameInfo,
    pub viewInfo: DataViewInfo,
    // I don't want to create another channel for query
    // Let's just place it here

}

pub struct FullResponse {
    pub view: ViewResponse,
    pub frameInfo: DataFrameInfo,
}

impl FullResponse {
    pub fn send(
        self,
        infoChannel: InfoChannel,
        dataChannel: DataChannel,
        pageChannel: PageChannel,
    ) -> Result<(), String> {
        // TODO Here's the thing, I want frameInfo and viewInfo to store slightly different info
        // But you can't store them at a single layer, and I don't want to create an extra channel
        // A helper function to send the full response to the frontend
        let dataInfo = DataInfo {
            viewInfo: self.view.viewInfo,
            frameInfo: self.frameInfo,
        };

        infoChannel.send(dataInfo).unwrap();
        dataChannel.send(self.view.data).unwrap();
        pageChannel.send(self.view.pageInfo).unwrap();
        Ok(())
    }
}
