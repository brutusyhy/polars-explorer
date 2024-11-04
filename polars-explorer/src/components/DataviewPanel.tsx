import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import DataTable from "@/components/dataview/DataTable.tsx";
import {ColumnData} from "@/Typing.ts";
import PaginationControl from "@/components/dataview/PaginationControl.tsx";

export default function DataviewPanel({data}: { data: ColumnData[] }) {

    return (
        <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
                {/* 2.a Fix Table Horizontal Scrolling*/}
                <ResizablePanel defaultSize={90} className="!overflow-y-scroll !overflow-x-scroll">
                    <DataTable columns={data}/>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={10}>
                    <PaginationControl/>Pagination Control
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
    )
}