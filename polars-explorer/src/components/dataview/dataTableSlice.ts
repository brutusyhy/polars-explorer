import {TableData} from "@/Typing.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/redux/store.ts";


interface DataTableState {
    data: TableData
}

const initialState: DataTableState = {
    data: []
}

export const dataTableSlice = createSlice({
    name: "dataTable",
    initialState,
    reducers: {
        loadData: (state, action: PayloadAction<TableData>) => {
            state.data = action.payload
        }
    }
})

export const {loadData} = dataTableSlice.actions;

export const selectData = (state: RootState) => state.dataTable.data;

export default dataTableSlice.reducer;