import {DataChannel, DataInfo, InfoChannel, DataJSON, PageChannel, PageInfo} from "@/Typing.ts";
import {Channel} from "@tauri-apps/api/core";
import {loadView} from "@/components/frameview/frameViewSlice.ts";
import {loadData} from "@/components/dataexplorer/datatable/dataTableSlice.ts";
import {setPagination} from "@/components/dataexplorer/pagination/paginationSlice.ts";
import {store} from "@/redux/store.ts";


// Info Channel notifies the frontend whether the dataframe already exists in memory
// Data Channel provides the frontend with paginated query result
// Page Channel provides paging information for the current result


// Use Thunks function to generate channels before all communication
// @ts-ignore
function createChannelsThunk(dispatch, getState) {
    console.log("Channels initiated");

    // All channels are transient
    // They need to be recreated before every communication
    let infoChannel: InfoChannel = new Channel<DataInfo>();
    let dataChannel: DataChannel = new Channel<DataJSON>();
    let pageChannel: PageChannel = new Channel<PageInfo>();


    infoChannel.onmessage = (message: DataInfo) => {
        console.log("InfoChannel Message")
        //console.log(message.frameInfo)
        //console.log(message.viewInfo)
        dispatch(loadView(message));
    };

    dataChannel.onmessage = (message: DataJSON) => {
        console.log("DataChannel Message")
        dispatch(loadData(message.columns));
    };

    pageChannel.onmessage = (message: PageInfo) => {
        console.log("PageChannel Message")
        //console.log(message)
        dispatch(setPagination(message));
    };
    return {
        infoChannel: infoChannel,
        dataChannel: dataChannel,
        pageChannel: pageChannel,
    };
}

export const createChannels = () => store.dispatch(createChannelsThunk)