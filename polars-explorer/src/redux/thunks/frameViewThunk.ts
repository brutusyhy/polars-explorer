// TODO: Review this approach of using thunk function in commands
import {frameViewSlice} from "@/redux/slices/frameViewSlice.ts";
import {store} from "@/redux/store.ts";


// A thunk function that allows commands to access and affect Redux states
// TODO: This approach goes against my original architecture design
// In my design, the frontend should change as a result of message from the backend
// Not mutating itself
// But let's go with this approach for now
function deleteFrameThunk(frameKey: number) {
    return (dispatch, getState) => {
        dispatch(frameViewSlice.actions.deleteFrame(frameKey))
    }
}

export const deleteFrameCommand = (frameKey: number) => store.dispatch(deleteFrameThunk(frameKey));

function renameFrameThunk(frameKey: number, name: string) {
    return (dispatch, getState) => {
        dispatch(frameViewSlice.actions.renameFrame([frameKey, name]))
    }
}

export const renameFrameCommand = (frameKey: number, name: string) => store.dispatch(renameFrameThunk(frameKey, name));