import {DataChannel, DataInfo, InfoChannel, DataJSON, PageChannel, PageInfo, ClearChannel} from "@/Typing.ts";
import {Channel} from "@tauri-apps/api/core";
import {clearQueryPlan, loadView, resetFrameView} from "@/redux/slices/frameViewSlice.ts";
import {loadData, resetData} from "@/redux/slices/dataTableSlice.ts";
import {resetPagination, setPagination} from "@/redux/slices/paginationSlice.ts";
import {store} from "@/redux/store.ts";


// Info Channel notifies the frontend whether the dataframe already exists in memory
// Data Channel provides the frontend with paginated query result
// Page Channel provides paging information for the current result


// Use Thunks function to generate channels before all communication
// It would be messy to set up individual Channel thunk functions
// @ts-ignore
function createChannelsThunk(dispatch, getState) {
    console.log("Channels initiated");

    // All channels are transient
    // They need to be recreated before every communication
    let infoChannel: InfoChannel = new Channel<DataInfo>();
    let dataChannel: DataChannel = new Channel<DataJSON>();
    let pageChannel: PageChannel = new Channel<PageInfo>();
    let clearChannel: ClearChannel = new Channel<boolean>();

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

    clearChannel.onmessage = (message: boolean) => {
        // TODO: There's still some confusion as to the role of clearChannel
        // For now, I will let it clear the Data and Pagination info
        // And also the queryPlan
        // They are safe to clear, unlike FrameViewTree
        console.log("ClearChannel Message");
        dispatch(resetData());
        dispatch(resetPagination());
        dispatch(clearQueryPlan());
    }
    return {
        infoChannel,
        dataChannel,
        pageChannel,
        clearChannel
    };
}

export const createChannels = () => store.dispatch(createChannelsThunk)