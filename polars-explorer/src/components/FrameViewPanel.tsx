import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import FrameViewTree from "@/components/frameview/FrameViewTree.tsx";
import FrameViewInfo from "@/components/frameview/FrameViewInfo.tsx";


export default function FrameViewPanel() {
    return (
        <ResizablePanel defaultSize={20}>
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50} className="!overflow-y-scroll !overflow-x-scroll">
                    <FrameViewTree/>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={50}>
                    <FrameViewInfo/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ResizablePanel>
    )

}