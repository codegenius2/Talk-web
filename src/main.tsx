import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Auth from "./auth/page.tsx";
import Error from "./error.tsx";
import Home from "./home/home.tsx";
import {Experiment} from "./experiment/experiment.tsx";
import Drag from "./experiment/drag";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        errorElement: <Error/>,
    },
    {
        path: "/auth",
        element: <Auth/>,
        errorElement: <Error/>,
    },
    {
        path: "/chat",
        element: <Home/>,
        errorElement: <Error/>,
    },
    {
        path: "/exp",
        element: <Experiment/>,
        errorElement: <Error/>,
    },
    {
        path: "/exp/drag",
        element: <Drag/>,
        errorElement: <Error/>,
    },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
