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
export type DataJSON = {
    columns: ColumnData[]
}

export type DataChannel = Channel<DataJSON>;

// Key associated with each DataFrame
export type Key = number;

export type DataFrameInfo = {
    key: Key,
    name: string,
    length: number,
}

export type QueryInfo = {
    plan: string
}

export type DataViewInfo = {
    name: string,
    key: number,
    rows: number,
    cols: number,
    queryInfo: QueryInfo
}

export type DataInfo = {
    frameInfo: DataFrameInfo,
    viewInfo: DataViewInfo
}

export type InfoChannel = Channel<DataInfo>;

// In order to work with Immer, we need to use vanilla object rather than map
// Which is serializable
//export type DataFrameMap = Map<Key, DataFrameInfo>;
export type DataFrameMap = {
    [frameKey: Key]: DataFrameInfo
}

export type ViewMap = {
    [viewKey: Key]: DataViewInfo
}

// Map frame to their views
export type FrameViewMap = {
    [frameKey: Key]: ViewMap
}


export type FrameViewKey = [frameKey: number, viewKey: number];

export type PageInfo = {
    pageSize: number,
    currentPage: number,
    totalPage: number,
}

export type PageChannel = Channel<PageInfo>;

// This type is used to pass an array from the frontend to the backend
// It should be a serialized Array in JSON format
export type JSONArray = string;

export type ClearChannel = Channel<boolean>;