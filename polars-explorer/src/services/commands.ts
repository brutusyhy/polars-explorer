// This service handles communication with the backend


import {invoke} from "@tauri-apps/api/core";
import {createChannels} from "@/services/channels.ts";


export async function open_csv({pageSize}: { pageSize: number }) {
    // ALl the channels need to be recreated before communication
    // We use a Redux thunk function, since we aren't normally permitted to call hook functions here.
    const {infoChannel, dataChannel, pageChannel} = createChannels();
    console.log("Invoke open_csv")
    await invoke("open_csv", {
        infoChannel,
        dataChannel,
        pageChannel,
        pageSize
    });
}


// TODO export async function switch_dataframe()
export async function switch_dataframe({key, pageSize}: { key: number, pageSize: number }) {
    const {infoChannel, dataChannel, pageChannel} = createChannels();
    console.log("Invoke switch_dataframe");
    await invoke("switch_dataframe", {
        key,
        infoChannel,
        dataChannel,
        pageChannel,
        pageSize
    })
}