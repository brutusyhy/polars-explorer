import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";

export default function QueryPanel() {
    return (
        <ResizablePanel defaultSize={20}>
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50}>
                    <div>Query History</div>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={50}>
                    <div>Query crafter</div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
    );
}