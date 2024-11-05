import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import DataFrameList from "@/components/dataframe/DataFrameList.tsx";


export default function DataFramePanel() {
    return (
        <ResizablePanel defaultSize={20}>
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50}>
                    {/* Prop drilling for now...I know */}
                    <DataFrameList/>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={50}>
                    {/* TODO */}
                    {/* Maybe better to use this panel to display dataframe info? */}
                    <div>DataFrame Info</div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
    )

}