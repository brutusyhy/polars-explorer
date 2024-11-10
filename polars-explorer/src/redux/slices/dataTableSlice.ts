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
        },
        resetData: (state) => {
            Object.assign(state, initialState)
        }
    }
})

export const {loadData, resetData} = dataTableSlice.actions;

export const selectData = (state: RootState) => state.dataTable.data;
export const selectColumnInfo = (state: RootState) => {
    return state.dataTable.data.map(col => {
        return {name: col.name, datatype: col.datatype}
    })
}

export default dataTableSlice.reducer;