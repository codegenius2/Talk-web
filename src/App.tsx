import {useAuthStore} from "./state/Auth.tsx";
import Auth from "./component/auth/Auth.tsx";
import './App.css'

import Home from "./component/Home.tsx";

const fadeInDuration = 2000

export default function App() {

    const verified = useAuthStore((state) => state.verified);

    return (
        <div>
            {(!verified) && <Auth/>}
            {/*home page fades in*/}
            <div
                className={`transition-opacity duration-${fadeInDuration} ${verified ? 'opacity-100' : 'opacity-20'}`}>
                {verified && <Home/>}
            </div>
        </div>
    );
}