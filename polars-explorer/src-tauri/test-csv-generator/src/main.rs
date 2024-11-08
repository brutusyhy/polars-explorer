use std::fmt::Display;
use std::fs::File;
use std::io::{BufWriter, Write};
use rand::{random, Rng};
use rand::seq::{IteratorRandom, SliceRandom};
use fake::{Dummy, Fake, Faker};
use struct_iterable::Iterable;
use serde::Serialize;

#[derive(Debug, Dummy, Iterable, Serialize)]
pub struct AllBaseTypes {
    Boolean: bool,
    UTF8String: String,
    UInt64: u64,
    Int64: i64,
    Float64: f64,
}
impl AllBaseTypes {
    pub fn to_values(&self) -> Vec<Box<dyn Display + '_>> {
        let vals: Vec<Box<dyn Display>> = vec![Box::new(&self.Boolean),
                                               Box::new(&self.UTF8String),
                                               Box::new(&self.UInt64),
                                               Box::new(&self.Int64),
                                               Box::new(&self.Float64)];
        vals
    }

    pub fn write_well_formatted(&self, writer: &mut BufWriter<File>, sep: &str) {
        write_line(writer, self.to_values(), sep);
    }

    pub fn write_with_possible_missing(&self,
                                       writer: &mut BufWriter<File>,
                                       sep: &str) {
        // Possible to have missing values
        let vals = self.to_values();
        let mut new_vals: Vec<String> = Vec::new();
        for val in vals.iter() {
            if random::<bool>() {
                new_vals.push(val.to_string());
            } else {
                new_vals.push("".to_string());
            }
        }
        write_line(writer, new_vals, sep);
    }

    pub fn write_line_with_misalignment(&self,
                                        writer: &mut BufWriter<File>,
                                        sep: &str)
    {
        let mut vals = self.to_values();
        let length = vals.len();
        vals.shuffle(&mut rand::thread_rng());
        write_line(writer, vals, sep);
    }
}

pub fn write_line<T: Display>(writer: &mut BufWriter<File>, vals: Vec<T>, sep: &str) {
    let length = vals.len();
    // We will write the last value without separator and with a new line
    for i in 0..length - 1 {
        write!(writer, "{}{}", vals[i], sep).unwrap();
    }
    writeln!(writer, "{}", vals[length - 1]).unwrap();
}

fn generate_well_formatted_basetypes(sep: &str, suffix: usize) {
    // This function will generate a well-formatted csv file with one column for each of the
    // currently supported datatypes in Polars:
    // https://docs.rs/polars/latest/polars/datatypes/enum.AnyValue.html#variants
    let filename = format!("csv\\well_formatted_basetypes{}.csv", suffix);
    let file = File::create(filename).unwrap();
    let mut writer = BufWriter::new(file);
    writeln!(writer, "Boolean,UTF8String,UInt64,Int64,Float64").unwrap();
    for _ in 0..1000 {
        let f: AllBaseTypes = Faker.fake();
        f.write_well_formatted(&mut writer, sep);
    }
}

fn generate_well_formatted_basetypes_with_missing_values(sep: &str, suffix: usize) {
    let filename = format!("csv\\well_formatted_basetypes_with_missing_values{}.csv", suffix);
    let file = File::create(filename).unwrap();
    let mut writer = BufWriter::new(file);
    writeln!(writer, "Boolean,UTF8String,UInt64,Int64,Float64").unwrap();
    for _ in 0..1000 {
        let f: AllBaseTypes = Faker.fake();
        f.write_with_possible_missing(&mut writer, sep);
    }
}

fn generate_basetypes_with_misalignment(sep: &str, suffix: usize, percentage: usize) {
    let filename = format!("csv\\basetypes_with_misalignment{}.csv", suffix);
    let file = File::create(filename).unwrap();
    let mut writer = BufWriter::new(file);
    writeln!(writer, "Boolean,UTF8String,UInt64,Int64,Float64").unwrap();
    for _ in 0..1000 {
        let f: AllBaseTypes = Faker.fake();
        if rand::thread_rng().gen_range(0..100) < percentage {
            f.write_line_with_misalignment(&mut writer, sep);
        } else {
            f.write_well_formatted(&mut writer, sep);
        }
    }
}

fn main() {
    generate_well_formatted_basetypes(",", 0);
    generate_well_formatted_basetypes("\t", 1);
    generate_well_formatted_basetypes_with_missing_values(",", 0);
    generate_well_formatted_basetypes_with_missing_values("\t", 1);
    generate_basetypes_with_misalignment(",", 0, 10);
    generate_basetypes_with_misalignment("\t", 1, 90);
}
