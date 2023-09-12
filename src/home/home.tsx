import {useEffect, useState} from "react";
import {useSnapshot} from "valtio/react";
import {appState, Chat} from "../state/app-state.ts";
import {Panel} from "./panel/panel.tsx";
import {SSE} from "../api/sse/sse.tsx";
import {Workers} from "../worker/workers.tsx";
import {WindowListeners} from "../window-listeners.tsx";
import {WallpaperSimultaneousCounter} from "../wallpaper/wallpaper.tsx";
import {ChatWindow} from "./chat-window/chat-window.tsx";


export default function Home() {
    const appSnp = useSnapshot(appState)

    const [chatProxy, setChatProxy] = useState<Chat | undefined>(undefined)

    useEffect(() => {
        const cp = appState.chats[appSnp.currentChatId]
        setChatProxy(cp)
    }, [appSnp])

    return (
        <div>
            {/*<WallpaperWalkInGreen/>*/}
            {/*<WallpaperBalloon/>*/}
            <WallpaperSimultaneousCounter/>
            {/*<WallpaperDefault/>*/}
            <div
                className="flex h-screen w-screen items-center justify-center gap-2 overflow-hidden p-3 home lg:gap-5">
                <div className="hidden sm:block h-full min-w-60 max-w-86">
                    <Panel/>
                </div>
                {chatProxy === undefined &&
                    <div
                        className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-white bg-opacity-40 backdrop-blur">
                    </div>
                }
                {chatProxy !== undefined &&
                    <ChatWindow chatProxy={chatProxy}/>
                }
            </div>
            <SSE/>
            <Workers/>
            <WindowListeners/>
        </div>
    )
}
