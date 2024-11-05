import {DataChannel, DataFrameInfo, InfoChannel, JSONValue, PageChannel, PageInfo} from "@/Typing.ts";
import {Channel} from "@tauri-apps/api/core";
import {useAppDispatch} from "@/redux/hooks.ts";
import {loadDataFrame} from "@/components/dataframe/dataFrameSlice.ts";
import {loadData} from "@/components/dataview/dataTableSlice.ts";
import {setPagination} from "@/components/dataview/paginationSlice.ts";


// Info Channel notifies the frontend whether the dataframe already exists in memory
// Data Channel provides the frontend with paginated query result
// Page Channel provides paging information for the current result


// Use Thunks function to generate channels before all communication
// @ts-ignore
export function createChannelsThunk(dispatch, getState) {
    console.log("Channels initiated");

    // Initialize channels only once and persist them across renders
    let infoChannel: InfoChannel = new Channel<DataFrameInfo>();
    let dataChannel: DataChannel = new Channel<JSONValue>();
    let pageChannel: PageChannel = new Channel<PageInfo>();


    infoChannel.onmessage = (message: DataFrameInfo) => {
        console.log("InfoChannel Message")
        dispatch(loadDataFrame(message));
    };

    dataChannel.onmessage = (message: JSONValue) => {
        console.log("DataChannel Message")
        dispatch(loadData(message.columns));
    };

    pageChannel.onmessage = (message: PageInfo) => {
        console.log("PageChannel Message")
        dispatch(setPagination(message));
    };
    return {
        infoChannel: infoChannel,
        dataChannel: dataChannel,
        pageChannel: pageChannel,
    };
}

