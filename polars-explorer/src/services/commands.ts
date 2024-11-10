// This service handles communication with the backend


import {invoke} from "@tauri-apps/api/core";
import {createChannels} from "@/services/channels.ts";
import {getOpenedFrameViewKey} from "@/redux/slices/frameViewSlice.ts";
import {
    deleteFrameCommand,
    deleteViewCommand,
    getOpenedFrameViewKeyCommand,
    renameFrameCommand, renameViewCommand
} from "@/redux/thunks/frameViewThunk.ts";


export async function open_csv({pageSize}: { pageSize: number }) {
    // ALl the channels need to be recreated before communication
    // We use a Redux thunk function, since we aren't normally permitted to call hook functions here.
    const {infoChannel, dataChannel, pageChannel} = createChannels();
    console.log("Open csv")
    await invoke("open_csv", {
        infoChannel,
        dataChannel,
        pageChannel,
        pageSize
    });
}

export async function switch_view({frameKey, viewKey, pageSize}: {
    frameKey: number,
    viewKey: number,
    pageSize: number
}) {
    const {infoChannel, dataChannel, pageChannel} = createChannels();
    console.log(`Switch to Dataframe #${frameKey} View #${viewKey}`);
    await invoke("switch_view", {
        frameKey,
        viewKey,
        page: 0,
        pageSize,
        infoChannel,
        dataChannel,
        pageChannel
    })
}

// turn_page can only be done over the current view, so no need to pass frameKey and viewKey
export async function turn_page({page, pageSize}: {
    page: number,
    pageSize: number
}) {
    const [frameKey, viewKey] = getOpenedFrameViewKeyCommand();
    const {infoChannel, dataChannel, pageChannel} = createChannels();
    console.log(`Turn to page ${page}`);
    await invoke("turn_page", {
        frameKey,
        viewKey,
        page,
        pageSize,
        infoChannel,
        dataChannel,
        pageChannel
    })
}

// select_columns can only be done over the current view, so no need to pass frameKey and viewKey
export async function select_columns({pageSize, columns}: {
    pageSize: number,
    columns: string[]
}) {
    const [frameKey, viewKey] = getOpenedFrameViewKeyCommand();
    const {infoChannel, dataChannel, pageChannel} = createChannels();
    console.log(`Select columns ${columns}`);
    const columnJson = JSON.stringify(columns);
    await invoke("select_columns", {
        frameKey,
        viewKey,
        pageSize,
        columnJson,
        infoChannel,
        dataChannel,
        pageChannel
    })
}

// TODO: not ideal not ideal...
// We are manually deleting frame from the treeon the frontend
// Rather than relying on a passed message
// But maybe it's acceptable?
export async function delete_frame({frameKey}: {
    frameKey: number,
}) {
    const currentFrameKey = getOpenedFrameViewKeyCommand()[0];
    const {clearChannel} = createChannels();
    console.log(`Delete frame ${frameKey}`)
    await invoke("delete_frame", {
        frameKey,
        currentFrameKey,
        clearChannel
    });
    deleteFrameCommand(frameKey)
}

// Backend communication might still be useful?
// In the future, we can allow backend to save its state to a file
// Names can thus also be preserved.
// TODO: Reconsider whether we should update the frontend with message
export async function rename_frame({frameKey, name}: {
    frameKey: number,
    name: string,
}) {
    console.log(`Renaming frame ${frameKey} to ${name}`);
    await invoke("rename_frame", {
        frameKey,
        name,
    });
    renameFrameCommand(frameKey, name);
}

export async function delete_view({frameKey, viewKey}: {
    frameKey: number,
    viewKey: number,
}) {
    const [currentFrameKey, currentViewKey] = getOpenedFrameViewKeyCommand();
    const {clearChannel} = createChannels();
    console.log(`Deleting View ${frameKey}-${viewKey}`)
    await invoke("delete_view", {
        frameKey,
        viewKey,
        currentFrameKey,
        currentViewKey,
        clearChannel
    })
    deleteViewCommand(frameKey, viewKey)
}

export async function rename_view({frameKey, viewKey, name}: {
    frameKey: number,
    viewKey: number
    name: string,
}) {
    console.log(`Renaming view ${frameKey}-${viewKey} to ${name}`);
    await invoke("rename_frame", {
        frameKey,
        viewKey,
        name,
    });
    renameViewCommand(frameKey, viewKey, name);
}


export async function turn_view_into_frame({frameKey, viewKey}: {
    frameKey: number,
    viewKey: number,
}) {
    console.log(`Turn view ${frameKey}-${viewKey} into a standalone frame`);
    const {infoChannel} = createChannels();
    await invoke("turn_view_into_frame", {
        frameKey,
        viewKey,
        infoChannel
    });
    // The infoChannel will correctly add new Frame
    // But we need to delete old view
    deleteViewCommand(frameKey, viewKey);

}