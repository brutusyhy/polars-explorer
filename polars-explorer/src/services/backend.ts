// This service handles communication with the backend

import {DataChannel, InfoChannel, PageChannel} from "@/Typing.ts";
import {invoke} from "@tauri-apps/api/core";

export async function open_csv(
    {infoChannel, dataChannel, pageChannel, pageSize}: {
        infoChannel: InfoChannel,
        dataChannel: DataChannel,
        pageChannel: PageChannel,
        pageSize: number
    }) {
    console.log("Invoke open_csv")
    await invoke("open_csv", {
        infoChannel: infoChannel,
        dataChannel: dataChannel,
        pageChannel: pageChannel,
        pageSize: pageSize
    });
}