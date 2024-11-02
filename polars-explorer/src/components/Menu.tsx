import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"

import {invoke} from "@tauri-apps/api/core";

export default function Menu() {
    return (<Menubar>
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={async () => {
                    await invoke("import_dataframe");
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