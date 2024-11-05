// This service handles communication with the backend


import {invoke} from "@tauri-apps/api/core";

// @ts-ignore
export async function open_csv({infoChannel, dataChannel, pageChannel, pageSize}) {
    console.log("Invoke open_csv")
    await invoke("open_csv", {
        infoChannel,
        dataChannel,
        pageChannel,
        pageSize
    });
}

// TODO export async function switch_dataframe()