import "./App.css";

import { useAppSelector } from "@/redux/hooks.ts";
import {
    selectDataFrameMap,
} from "@/redux/slices/frameViewSlice.ts";

import Menu from "@/components/Menu.tsx";
import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable.tsx";
import FrameViewPanel from "@/components/FrameViewPanel.tsx";
import DataExplorerPanel from "@/components/DataExplorerPanel.tsx";
import QueryPanel from "@/components/QueryPanel.tsx";

import { open_csv } from "@/services/commands.ts";
import { selectPageSize } from "@/redux/slices/paginationSlice.ts";

const open_file_icon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h9q.425 0 .713.288T22 7t-.288.713T21 8H7.85q-1.55 0-2.7.975T4 11.45V18l1.975-6.575q.2-.65.738-1.037T7.9 10h12.9q1.025 0 1.613.813t.312 1.762l-1.8 6q-.2.65-.737 1.038T19 20z" /></svg>

function App() {
    // `data` contains the array of column data
    // const [data, setData] = useState<TableData>([]);
    // const {
    //     dataFrameMap,
    //     selectedDataFrame,
    //     loadDataFrame,
    //     setSelectedDataFrame
    // } = useDataFrame();
    // const {
    //     data,
    //     pageInfo,
    //     setData,
    //     setPageInfo,
    //     updatePageInfo
    // } = useDataview();

    const dataFrameMap = useAppSelector(selectDataFrameMap);
    const has_frame = Object.keys(dataFrameMap).length !== 0;
    const pageSize = useAppSelector(selectPageSize)

    return (
        <div className="AppContainer bg-background">
            {/* Menu Bar */}
            <Menu />
            {has_frame ?
                <ResizablePanelGroup direction="horizontal">
                    {/* Left Panel: DataFramePanel */}
                    <FrameViewPanel />
                    <ResizableHandle withHandle />

                    {/* Middle Panel: DataviewPanel*/}
                    {/* TODO: We are now passing `data`, but it actually should be based on DataFrame states */}
                    <DataExplorerPanel />
                    <ResizableHandle withHandle />

                    {/* Right Panel: Query History and Query Crafter*/}
                    <QueryPanel />
                </ResizablePanelGroup>
                : <div className="flex flex-col  items-center h-full gap-6">
                    <span className="flex-[0.4]"></span>
                    <h2 className="font-semibold tracking-wide text-5xl py-6">Polaris Explorer</h2>
                    <div className="flex flex-col gap-6 text-lg">
                        <button className="flex gap-4 items-center hover:scale-105 transition ease-in" onClick={async () => {
                            await open_csv({
                                pageSize
                            });
                        }}>
                            {open_file_icon}
                            Open File
                        </button>
                        <button className="flex gap-4 items-center hover:scale-105 transition ease-in">
                            {open_file_icon}
                            Recents
                        </button>
                        <button className="flex gap-4 items-center hover:scale-105 transition ease-in">
                            {open_file_icon}
                            New file
                        </button>
                    </div>
                </div>
            }
        </div>

    );
}

export default App;
