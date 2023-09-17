import {Panel} from "./panel/panel.tsx";
import {SSE} from "../api/sse/sse.tsx";
import {Workers} from "../worker/workers.tsx";
import {WindowListeners} from "../window-listeners.tsx";
import {WallpaperSimultaneousCounter} from "../wallpaper/wallpaper.tsx";
import {ChatWindow} from "./chat-window/chat-window.tsx";
import {useEffect} from "react";
import {useSnapshot} from "valtio/react";
import {appState, hydrationState} from "../state/app-state.ts";
import {useNavigate} from "react-router-dom";
import {Helmet} from 'react-helmet';


export default function Home() {
    const hydrationSnap = useSnapshot(hydrationState)
    const authSnap = useSnapshot(appState.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (hydrationState.hydrated && !appState.auth.loggedIn) {
            navigate("/auth")
        }
    }, [hydrationSnap, authSnap, navigate]);

    return (
        hydrationSnap.hydrated ?
            <div>
                <Helmet>
                    <title>Let's Talk</title>
                </Helmet>
                {/*<WallpaperWalkInGreen/>*/}
                {/*<WallpaperBalloon/>*/}
                <WallpaperSimultaneousCounter/>
                {/*<WallpaperDefault/>*/}
                <div
                    className="flex h-screen w-screen items-center justify-center gap-2 overflow-hidden p-3 home lg:gap-5">
                    <div className="hidden sm:block h-full min-w-80 max-w-80">
                        <Panel/>
                    </div>
                    <ChatWindow/>
                </div>
                <SSE/>
                <Workers/>
                <WindowListeners/>
            </div>
            :
            <></>
    )
}
