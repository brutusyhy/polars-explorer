import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"


import {open_csv} from "@/services/backend.ts";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectPageSize} from "@/components/dataview/paginationSlice.ts";
import {createChannelsThunk} from "@/services/channels.ts";
import {DataChannel, DataFrameInfo, InfoChannel, JSONValue, PageChannel, PageInfo} from "@/Typing.ts";
import {Channel} from "@tauri-apps/api/core";
import {useEffect} from "react";
import {store} from "@/redux/store.ts";


// @ts-ignore
export default function Menu() {

    const pageSize = useAppSelector(selectPageSize)
    // 1.c.ii Receive JSON using receiver.onmessage


    return (<Menubar className="">
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={async () => {
                    // ALl the channels need to be recreated before communication
                    // We use a Redux thunk function, since we aren't normally permitted to call hook functions here.
                    const {infoChannel, dataChannel, pageChannel} = store.dispatch(createChannelsThunk)
                    await open_csv({
                        infoChannel,
                        dataChannel,
                        pageChannel,
                        pageSize
                    });
                }}>Open File</MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator/>
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator/>
                <MenubarItem>Print</MenubarItem>
            </MenubarContent>
        </MenubarMenu>
    </Menubar>)
}