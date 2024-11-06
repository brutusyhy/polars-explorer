import {
    DataFrameMap,
    DataInfo,
    FrameViewKey,
    FrameViewMap,
    Key,
    ViewMap
} from "@/Typing.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/redux/store.ts";

interface DataFrameState {
    dataFrameMap: DataFrameMap,
    frameViewMap: FrameViewMap
    openedView: FrameViewKey
}

const initialState: DataFrameState = {
    dataFrameMap: {},
    frameViewMap: {},
    openedView: [-1, -1]
}

export const dataFrameSlice = createSlice({
    name: "dataFrame",
    initialState,
    reducers: {
        // Redux uses immer internally, allowing us to "mutate" the state apparently
        loadView: (state, action: PayloadAction<DataInfo>) => {
            const {frameInfo, viewInfo} = action.payload;
            const frameKey = frameInfo.key;
            const viewKey = viewInfo.key;
            console.log(`loadView ${frameInfo.name} ${viewInfo.name}`)
            if (!state.dataFrameMap.hasOwnProperty(frameKey)) {
                // Neither the frame nor the view exists
                // Create both the frame and the view
                state.dataFrameMap[frameKey] = frameInfo;
                let newViewMap: ViewMap = {};
                newViewMap[viewKey] = viewInfo;
                state.frameViewMap[frameKey] = newViewMap;
            } else if (!state.frameViewMap[frameKey].hasOwnProperty(viewKey)) {
                // The frame exists but not the view
                // Add the view to the frameViewMap
                state.frameViewMap[frameKey][viewKey] = viewInfo;
            }
            state.openedView = [frameKey, viewKey];

        },


    }
})
export const {loadView} = dataFrameSlice.actions;
export const selectDataFrameMap = (state: RootState) => state.dataFrame.dataFrameMap;
export const selectFrameViewMap = (state: RootState) => state.dataFrame.frameViewMap;
export const selectOpenedView = (state: RootState) => state.dataFrame.openedView;


export default dataFrameSlice.reducer;