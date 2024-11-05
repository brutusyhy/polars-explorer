import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {store} from './redux/store.ts'
import {Provider} from "react-redux";

// Use Redux store
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </Provider>,
);
