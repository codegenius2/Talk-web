import {useEffect, useState} from "react";
import {useSnapshot} from "valtio/react";
import {appState, Chat} from "../state/app-state.ts";
import {Panel} from "../panel/panel.tsx";
import TextArea from "./component/text-area.tsx";
import Recorder from "./component/recorder.tsx";
import {SSE} from "../api/sse/sse.tsx";
import {Workers} from "../worker/workers.tsx";
import {WindowListeners} from "../window-listeners.tsx";
import {WallpaperSimultaneousCounter} from "../wallpaper/wallpaper.tsx";
import {MessageList} from "./component/message/message-list.tsx";

export default function ChatHome() {
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
                <div className="h-full min-w-60">
                    <Panel/>
                </div>
                {chatProxy === undefined &&
                    <div
                        className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-white bg-opacity-40 backdrop-blur">
                    </div>
                }
                {chatProxy !== undefined &&
                    <div
                        className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-white bg-opacity-40 backdrop-blur">
                        <MessageList chatProxy={chatProxy}/>
                        <div
                            className="bottom-0 mt-auto flex w-full flex-col items-center gap-2 rounded-xl px-2">
                            <TextArea chatProxy={chatProxy}/>
                            <div className="my-1 flex w-full items-center justify-center">
                                <Recorder chatId={chatProxy.id}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <SSE/>
            <Workers/>
            <WindowListeners/>
        </div>
    )
}
