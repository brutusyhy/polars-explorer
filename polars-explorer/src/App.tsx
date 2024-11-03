import "./App.css";
import Menu from "@/components/Menu.tsx";
import {Channel} from "@tauri-apps/api/core";
import {useState} from "react";
import DataTable from "@/components/datagrid/DataTable.tsx";

import {ResizablePanel, ResizableHandle, ResizablePanelGroup} from "@/components/ui/resizable.tsx";

function App() {
    // `data` contains the array of column data
    const [data, setData] = useState<Column[]>([]);

    // `receiver` receives the serialized dataframe query result from the backend
    const receiver = new Channel<JSONValue>();
    receiver.onmessage = (message) => {
        setData(message.columns);
    }
    return (
        <div className="AppContainer">
            {/* Menu Bar */}
            <Menu receiver={receiver}/>

            <ResizablePanelGroup direction="horizontal">
                {/* Left Panel: Dataframes and Views Selector */}
                <ResizablePanel defaultSize={20}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50}>
                            <div>DataFrame selector</div>
                        </ResizablePanel>
                        <ResizableHandle withHandle/>
                        <ResizablePanel defaultSize={50}>
                            <div>DataFrame views</div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle withHandle/>

                {/* Middle Panel: Data Viewer*/}
                <ResizablePanel defaultSize={60}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={90} className="!overflow-y-scroll">
                            <DataTable columns={data}/>
                        </ResizablePanel>
                        <ResizableHandle withHandle/>
                        <ResizablePanel defaultSize={10}>
                            <div>Pagination Control</div>
                        </ResizablePanel>
                    </ResizablePanelGroup>

                </ResizablePanel>

                <ResizableHandle withHandle/>

                {/* Right Panel: Query History and Query Crafter*/}
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
            </ResizablePanelGroup>
        </div>

    );
}

export default App;
