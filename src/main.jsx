import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import router from "./router.jsx";
import ToastProvider from "./contexts/ToastContainer.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ToastProvider>
        <RouterProvider router={router}/>
      </ToastProvider>
  </React.StrictMode>,
)
