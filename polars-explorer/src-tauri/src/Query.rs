// This type is used to pass an array from the frontend to the backend
// It should be a serialized Array in JSON format

use polars::prelude::{col, Expr};
use serde::Deserialize;
pub type JSONArray = String;


// Parse the incoming column JSONArray into a vector of Polars column expression
pub fn column_selector(columns: JSONArray) -> Result<Vec<Expr>, String> {
    // I will reconsider how to best handle errors in the future
    let columns: Vec<String> = serde_json::from_str(columns.as_str()).unwrap();
    Ok(columns
        .into_iter()
        .map(|col_name| col(col_name))
        .collect::<Vec<Expr>>())
}