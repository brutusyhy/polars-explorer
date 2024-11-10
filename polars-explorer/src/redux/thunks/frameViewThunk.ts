// TODO: Review this approach of using thunk function in commands
import {frameViewSlice} from "@/redux/slices/frameViewSlice.ts";
import {store} from "@/redux/store.ts";

function deleteFrameThunk(frameKey: number) {
    return (dispatch, getState) => {
        dispatch(frameViewSlice.actions.deleteFrame(frameKey))
    }
}

export const deleteFrameCommand = (frameKey: number) => store.dispatch(deleteFrameThunk(frameKey));
