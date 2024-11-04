use polars::frame::DataFrame;
use polars::prelude::{IdxSize, LazyFrame};
use crate::typing::JSONValue;


pub fn query_page(
    lf: LazyFrame,
    page: usize,
    page_size: usize,
) -> JSONValue {
    // 3.a Implement paginated query on the backend
    // LazyFrame.slice offers in-built support for range validation
    // https://docs.pola.rs/api/rust/dev/polars/prelude/struct.LazyFrame.html#method.slice
    let df = lf
        .slice((page * page_size) as i64, page_size as IdxSize)
        .collect()
        .unwrap();
    serde_json::to_value(&df).unwrap()
}

