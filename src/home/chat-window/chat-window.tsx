import {appState, Chat, currentChatProxy} from "../../state/app-state.ts";
import {MessageList} from "./message-list.tsx";
import TextArea from "./text-area.tsx";
import Recorder from "./recorder.tsx";
import React, {useEffect, useState} from "react";
import {useSnapshot} from "valtio/react";
import {snapshot} from "valtio";

export const ChatWindow: React.FC = () => {

    const appSnap = useSnapshot(appState)
    const [chatProxy, setChatProxy] = useState<Chat | undefined>(undefined)
    const [chatSnap, setChatSnap] = useState<Chat | undefined>(undefined)

    useEffect(() => {
        const cp = currentChatProxy()
        setChatProxy(cp)
        if (cp) {
            const snap = snapshot(cp)
            setChatSnap(snap as Chat)
        }
    }, [appSnap.chats, appSnap.currentChatId])

    return <div
        className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-neutral-200 bg-opacity-40 backdrop-blur">
        {chatSnap === undefined && <></>}
        {chatSnap !== undefined && chatProxy !== undefined &&
            <>
                <MessageList chatProxy={chatProxy}/>
                <div
                    className="bottom-0 mt-auto flex w-full flex-col items-center gap-2 rounded-xl px-2">
                    <TextArea chatProxy={chatProxy}/>
                    <div className="my-1 flex w-full items-center justify-center">
                        <Recorder chatId={chatProxy.id}/>
                    </div>
                </div>
            </>
        }
    </div>;
}
