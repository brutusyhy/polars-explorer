import "./App.css";


import Menu from "@/components/Menu.tsx";
import {ResizableHandle, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import FrameViewPanel from "@/components/FrameViewPanel.tsx";
import DataExplorerPanel from "@/components/DataExplorerPanel.tsx";
import QueryPanel from "@/components/QueryPanel.tsx";


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

    return (
        <div className="AppContainer">
            {/* Menu Bar */}
            <Menu/>
            <ResizablePanelGroup direction="horizontal">
                {/* Left Panel: DataFramePanel */}
                <FrameViewPanel/>
                <ResizableHandle withHandle/>

                {/* Middle Panel: DataviewPanel*/}
                {/* TODO: We are now passing `data`, but it actually should be based on DataFrame states */}
                <DataExplorerPanel/>
                <ResizableHandle withHandle/>

                {/* Right Panel: Query History and Query Crafter*/}
                <QueryPanel/>
            </ResizablePanelGroup>
        </div>

    );
}

export default App;
