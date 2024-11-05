import {DataChannel, DataFrameInfo, InfoChannel, JSONValue, PageChannel, PageInfo} from "@/Typing.ts";
import {Channel} from "@tauri-apps/api/core";
import {createSlice} from "@reduxjs/toolkit";


interface channelState {
    infoChannel: InfoChannel,
    dataChannel: DataChannel,
    pageChannel: PageChannel
}

const initialState: channelState = {
    infoChannel: new Channel<DataFrameInfo>(),
    dataChannel: new Channel<JSONValue>(),
    pageChannel: new Channel<PageInfo>()
}

export const channelSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
        getChannels: (state) => {
            
        }
    }
})