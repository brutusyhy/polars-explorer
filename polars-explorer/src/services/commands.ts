// This service handles communication with the backend


import {invoke} from "@tauri-apps/api/core";
import {createChannels} from "@/services/channels.ts";


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

export async function turn_page({frameKey, viewKey, page, pageSize}: {
    frameKey: number,
    viewKey: number,
    page: number,
    pageSize: number
}) {
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

export async function select_columns({frameKey, viewKey, pageSize, columns}: {
    frameKey: number,
    viewKey: number,
    pageSize: number,
    columns: string[]
}) {
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

// TODO: Context Menu
// export async function rename_view({frameKey, viewKey, name}: {
//     frameKey: number,
//     viewKey: number,
//     name: string
// }) {
//     // Does rename actually need any feedback? Hmmm
//     // Better not. Unnecessarily complicated and no practical significance.
//     console.log(`Renaming view ${frameKey}-${viewKey}`);
//
// }