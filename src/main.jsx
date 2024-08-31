import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import router from "./router.jsx";
import ToastProvider from "./contexts/ToastContainer.jsx";
import './styles/styles.css'
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev/index.js";
import {SearchProvider} from "./contexts/SearchContext.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ToastProvider>
            <DevSupport ComponentPreviews={ComponentPreviews}
                        useInitialHook={useInitial}>
                <SearchProvider>
                <RouterProvider router={router}/>
                </SearchProvider>
            </DevSupport>
        </ToastProvider>
    </React.StrictMode>,
)
