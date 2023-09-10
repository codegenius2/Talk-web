import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Auth from "./auth/page.tsx";
import Error from "./error.tsx";
import ChatHome from "./chat/page.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ChatHome/>,
        errorElement: <Error/>,
    },
    {
        path: "/auth",
        element: <Auth/>,
        errorElement: <Error/>,
    },
    {
        path: "/chat",
        element: <ChatHome/>,
        errorElement: <Error/>,
    },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
