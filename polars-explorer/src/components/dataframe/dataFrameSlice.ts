import {DataFrameInfo, DataFrameMap, Key} from "@/Typing.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/redux/store.ts";

interface DataFrameState {
    dataFrameMap: DataFrameMap,
    openedDataFrame: Key
}

const initialState: DataFrameState = {
    dataFrameMap: {},
    openedDataFrame: -1
}

export const dataFrameSlice = createSlice({
    name: "dataFrame",
    initialState,
    reducers: {
        // Redux uses immer internally, allowing us to "mutate" the state apparently
        loadDataFrame: (state, action: PayloadAction<DataFrameInfo>) => {

            const df = action.payload;
            console.log(`loadDataFrame ${df.key}`)
            if (!state.dataFrameMap.hasOwnProperty(df.key)) {
                state.dataFrameMap[df.key] = df;
            }
            state.openedDataFrame = df.key;
        },
        openDataFrame: (state, action: PayloadAction<Key>) => {
            state.openedDataFrame = action.payload;
        }
    }
})
export const {loadDataFrame, openDataFrame} = dataFrameSlice.actions;
export const selectDataFrameMap = (state: RootState) => state.dataFrame.dataFrameMap;
export const selectOpenedDataFrame = (state: RootState) => state.dataFrame.openedDataFrame;


export default dataFrameSlice.reducer;