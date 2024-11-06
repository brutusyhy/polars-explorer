// Handles LazyFrame
use polars::prelude::*;

// An optimized method to query the number of rows
pub fn get_rows(lf: LazyFrame) -> PolarsResult<usize> {
    // Get the length of the lazyframe
    // The idea is that LazyFrame should be minimal before concretized
    // We add a column for index, and grab the final index
    let count_df = lf
        .with_row_index("index", Some(1))
        .select([col("index")])
        .last()
        .collect();

    Ok(count_df?.column("index")?.get(0)?.try_extract::<usize>()?)
}

// An optimized method to query the number of columns
pub fn get_cols(lf: LazyFrame) -> PolarsResult<usize> {
    let count_df = lf.first().collect();
    Ok(count_df?.width())
}
