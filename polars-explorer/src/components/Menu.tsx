import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"


import {open_csv} from "@/services/commands.ts";
import {useAppSelector} from "@/redux/hooks.ts";
import {selectPageSize} from "@/redux/slices/paginationSlice.ts";
import {createChannels} from "@/services/channels.ts";


// @ts-ignore
export default function Menu() {

    const pageSize = useAppSelector(selectPageSize)
    // 1.c.ii Receive JSON using receiver.onmessage


    return (<Menubar className="">
        <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
                <MenubarItem onClick={async () => {
                    await open_csv({
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