import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PageInfo} from "@/Typing.ts";
import {RootState} from "@/redux/store.ts";


type PaginationState = PageInfo;

const initialState: PaginationState = {
    pageSize: 20,
    currentPage: -1,
    totalPages: -1,
}


export const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        // @ts-ignore
        setPagination: (state, action: PayloadAction<PageInfo>) => {
            state = Object.assign({}, action.payload)
        }
    }
})

export const {setPagination} = paginationSlice.actions;
export const selectPageSize = (state: RootState) => state.pagination.pageSize

export default paginationSlice.reducer;