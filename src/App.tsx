import {useAuthStore} from "./state/Auth.tsx";
import Auth from "./component/auth/Auth.tsx";
import './App.css'

import Home from "./component/Home.tsx";

export default function App() {

    const verified = useAuthStore((state) => state.verified);
    // return <Auth/>
    return (verified ? <Home/> : <Auth/>)
}