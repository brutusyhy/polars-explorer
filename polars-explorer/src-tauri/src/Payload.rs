use serde::Serialize;

pub type JSONValue = serde_json::Value;

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
    pub length: usize,
}

pub struct PagedResponse {
    pub response: JSONValue,
    pub pageInfo: PageInfo,
}