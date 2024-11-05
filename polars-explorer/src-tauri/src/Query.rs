// Handles LazyFrame
use polars::prelude::*;

pub fn len_lf(lf: LazyFrame) -> PolarsResult<usize> {
    // Get the length of the lazyframe
    let count_df = lf
        .with_row_index("index", Some(1))
        .select([col("index")])
        .last()
        .collect();

    Ok(count_df?
        .column("index")?
        .get(0)?.try_extract::<usize>()?)
}


