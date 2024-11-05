import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import DataTable from "@/components/dataview/DataTable.tsx";
import PaginationControl from "@/components/dataview/PaginationControl.tsx";

export default function DataViewPanel() {

    return (
        <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
                {/* 2.a Fix Table Horizontal Scrolling*/}
                <ResizablePanel defaultSize={80} className="!overflow-y-scroll !overflow-x-scroll">
                    <DataTable/>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={20}>
                    <PaginationControl/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
    )
}