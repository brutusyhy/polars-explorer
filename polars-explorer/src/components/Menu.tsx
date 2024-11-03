import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"

import {Channel, invoke} from "@tauri-apps/api/core";

export default function Menu({receiver}: { receiver: Channel<JSONValue> }) {

    // 1.c.ii Receive JSON using receiver.onmessage
    return (<Menubar className="">
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={async () => {
                    await invoke("import_dataframe", {receiver});
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