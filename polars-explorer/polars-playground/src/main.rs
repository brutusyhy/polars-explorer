const PATH: &str = r"C:\git\polars-explorer\polars-explorer\src-tauri\test-csv-generator\csv\basetypes_with_misalignment0.csv";

use polars::prelude::*;
fn main() {
    // let lf = LazyCsvReader::new(PATH).finish().unwrap();
    // let lf = lf.select([col("UTF8String")]);
    // println!("{}", lf.describe_plan().unwrap());
    let arr = "[1,2,3,4,5]";
    let cols: Vec<usize> = serde_json::from_str(arr).unwrap();
    println!("{:?}", cols);
}
