import "./App.css";


import {useDataFrame} from "@/hooks/DataFrame.ts";

import Menu from "@/components/Menu.tsx";
import {ResizableHandle, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import DataframePanel from "@/components/DataframePanel.tsx";
import DataviewPanel from "@/components/DataviewPanel.tsx";
import QueryPanel from "@/components/QueryPanel.tsx";
import {setupChannels} from "@/services/channels.ts";
import {useDataview} from "@/hooks/Dataview.ts";

function App() {
    // `data` contains the array of column data
    // const [data, setData] = useState<TableData>([]);
    const {
        dataFrameMap,
        selectedDataFrame,
        loadDataFrame,
        setSelectedDataFrame
    } = useDataFrame();
    const {
        data,
        setData,
        pagination,
        setPagination,
        updatePagination
    } = useDataview();
    const channels = setupChannels({loadDataFrame, setData, setPagination})


    return (
        <div className="AppContainer">
            {/* Menu Bar */}
            <Menu {...channels} pageSize={10}/>
            <ResizablePanelGroup direction="horizontal">
                {/* Left Panel: DataframePanel */}
                <DataframePanel dataFrameMap={dataFrameMap}/>
                <ResizableHandle withHandle/>

                {/* Middle Panel: DataviewPanel*/}
                {/* TODO: We are now passing `data`, but it actually should be based on Dataframe states */}
                <DataviewPanel data={data}/>
                <ResizableHandle withHandle/>

                {/* Right Panel: Query History and Query Crafter*/}
                <QueryPanel/>
            </ResizablePanelGroup>
        </div>

    );
}

export default App;
