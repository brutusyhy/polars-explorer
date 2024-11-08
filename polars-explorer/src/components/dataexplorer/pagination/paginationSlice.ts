import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PageInfo} from "@/Typing.ts";
import {RootState} from "@/redux/store.ts";


const initialState: PageInfo = {
    pageSize: 20,
    currentPage: -1,
    totalPage: -1,
}


export const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {

        setPagination: (state, action: PayloadAction<PageInfo>) => {
            const newPage = {...action.payload};
            state.pageSize = newPage.pageSize;
            state.totalPage = newPage.totalPage;
            state.currentPage = newPage.currentPage;
            console.log(`Action payload:`)
            //console.log(newPage)
            console.log(`Current state:`)
            //console.log(current(state))
        }
    }
})

export const {setPagination} = paginationSlice.actions;
export const selectPageSize = (state: RootState) => state.pagination.pageSize
export const selectCurrentPage = (state: RootState) => state.pagination.currentPage
export const selectTotalPage = (state: RootState) => state.pagination.totalPage

export default paginationSlice.reducer;