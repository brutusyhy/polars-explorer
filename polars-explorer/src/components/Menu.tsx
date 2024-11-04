import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"

import {DataChannel, InfoChannel, PageChannel} from "../Typing.ts"
import {open_csv} from "@/services/backend.ts";


export default function Menu({infoChannel, dataChannel, pageChannel, pageSize}: {
    infoChannel: InfoChannel,
    dataChannel: DataChannel,
    pageChannel: PageChannel,
    pageSize: number
}) {

    // 1.c.ii Receive JSON using receiver.onmessage
    return (<Menubar className="">
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={async () => {
                    await open_csv({
                        infoChannel: infoChannel,
                        dataChannel: dataChannel,
                        pageChannel: pageChannel,
                        pageSize: pageSize
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