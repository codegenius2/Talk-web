import {appState, Chat, currentChatProxy} from "../../state/app-state.ts"
import TextArea from "./text-area.tsx"
import Recorder from "./recorder.tsx"
import React, {useEffect, useState} from "react"
import {subscribeKey} from "valtio/utils";
import {MessageList} from "./message-list/message-list.tsx";

export const ChatWindow: React.FC = () => {

    const [chatProxy, setChatProxy] = useState<Chat | undefined>(undefined)
    // console.info("ChatWindow rendered", new Date().toLocaleString())

    useEffect(() => {
        const callback = () => {
            const cp = currentChatProxy()
            setChatProxy(cp)
        }
        const unsubscribe = subscribeKey(appState, "currentChatId", callback)
        callback()
        return unsubscribe
    }, [])

    return <div
        className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-neutral-200 bg-opacity-40 backdrop-blur">
        {chatProxy !== undefined &&
            <>
                <MessageList chatProxy={chatProxy} key={chatProxy.id}/>
                <div
                    className="bottom-0 mt-auto flex w-full flex-col items-center gap-2 rounded-xl px-2">
                    <TextArea chatProxy={chatProxy} key={chatProxy.id}/>
                    <div className="flex w-full items-center justify-center">
                        <Recorder chatId={chatProxy.id}/>
                    </div>
                </div>
            </>
        }
    </div>;
}
