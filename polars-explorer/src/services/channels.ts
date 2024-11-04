import {DataChannel, DataFrameInfo, InfoChannel, JSONValue, PageChannel, Pagination} from "@/Typing.ts";
import {Channel} from "@tauri-apps/api/core";

import {useEffect, useRef} from "react";
// Info Channel notifies the frontend whether the dataframe already exists in memory
// Data Channel provides the frontend with paginated query result
// Page Channel provides paging information for the current result

export function setupChannels({loadDataFrame, setData, setPagination}) {
    console.log("Channels initiated");

    // Initialize channels only once and persist them across renders
    const infoChannel = new Channel<DataFrameInfo>();
    const dataChannel = new Channel<JSONValue>();
    const pageChannel = new Channel<Pagination>();


    // Attach handlers to the channels only once
    infoChannel.onmessage = (message: DataFrameInfo) => {
        loadDataFrame(message);
    };

    dataChannel.onmessage = (message: JSONValue) => {
        setData(message.columns);
    };

    pageChannel.onmessage = (message: Pagination) => {
        setPagination(message);
    };


    return {
        infoChannel: infoChannel,
        dataChannel: dataChannel,
        pageChannel: pageChannel,
    };
}