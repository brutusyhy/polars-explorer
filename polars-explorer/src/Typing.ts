import {Channel} from "@tauri-apps/api/core";

export interface ColumnInfo {
    datatype: string,
    name: string,
}

// Data for individual columns
export interface ColumnData extends ColumnInfo {
    values: [],
}

export type Schema = ColumnInfo[];

// Data to be displayed in the table
export type TableData = ColumnData[];

// JSON load from the backend
export type JSONValue = {
    columns: ColumnData[]
}

export type DataChannel = Channel<JSONValue>;

// Key associated with each DataFrame
export type Key = number;

export type DataFrameInfo = {
    key: Key,
    name: string,
}

export type InfoChannel = Channel<DataFrameInfo>;

// In order to work with Immer, we need to use vanilla object rather than map
// Which is serializable
//export type DataFrameMap = Map<Key, DataFrameInfo>;
export type DataFrameMap = {
    [id: Key]: DataFrameInfo
}


export type PageInfo = {
    pageSize: number,
    currentPage: number,
    totalPages: number,
}

export type PageChannel = Channel<PageInfo>;
