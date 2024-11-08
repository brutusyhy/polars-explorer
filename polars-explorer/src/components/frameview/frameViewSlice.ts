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
    dataFrameMap: DataFrameMap
    frameViewMap: FrameViewMap
    openedFrameViewKey: FrameViewKey
    queryPlan: string
}

const initialState: DataFrameState = {
    dataFrameMap: {},
    frameViewMap: {},
    openedFrameViewKey: [-1, -1],
    queryPlan: ""
}

export const frameViewSlice = createSlice({
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
            state.openedFrameViewKey = [frameKey, viewKey];
            state.queryPlan = viewInfo.queryInfo.plan;
        },


    }
})
export const {loadView} = frameViewSlice.actions;
export const selectDataFrameMap = (state: RootState) => state.dataFrame.dataFrameMap;
export const selectFrameViewMap = (state: RootState) => state.dataFrame.frameViewMap;
export const selectOpenedFrameViewKey = (state: RootState) => state.dataFrame.openedFrameViewKey;
export const selectOpenedViewInfo = (state: RootState) => {
    const [frameKey, viewKey] = state.dataFrame.openedFrameViewKey;
    if (frameKey === -1) {
        return undefined;
    }
    return state.dataFrame.frameViewMap[frameKey][viewKey];
}

export const selectOpenedFrameInfo = (state: RootState) => {
    const frameKey = state.dataFrame.openedFrameViewKey[0];
    if (frameKey === -1) {
        return undefined;
    }
    return state.dataFrame.dataFrameMap[frameKey];
}

export const selectQueryPlan = (state: RootState) => state.dataFrame.queryPlan

export default frameViewSlice.reducer;