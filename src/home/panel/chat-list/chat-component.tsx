import React, {useCallback, useEffect, useState} from "react";
import {useSnapshot} from "valtio/react";
import {appState, Chat, deleteChat} from "../../../state/app-state.ts";
import {controlState} from "../../../state/control-state.ts";
import {Preview} from "./preview.tsx";
import {cx} from "../../../util/util.tsx";
import {TalkAvatar} from "./avatar.tsx";

type Props = {
    chatSnap: Chat
}

export const ChatComponent: React.FC<Props> = ({chatSnap}) => {
    const appSnap = useSnapshot(appState)
    const controlSnap = useSnapshot(controlState)
    const [selected, setSelected] = useState(false)
    const [over, setMouseOver] = useState(false)

    const onContainerMouseDownOrUp = useCallback(() => {
        appState.currentChatId = chatSnap.id
    }, [chatSnap.id])

    const onMouseEnter = useCallback(() => {
        if (controlSnap.isMouseLeftDown) {
            appState.currentChatId = chatSnap.id
        }
    }, [chatSnap.id, controlSnap.isMouseLeftDown])

    const removeChat = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        deleteChat(chatSnap.id)
    }, [chatSnap.id])

    const onDeleteButtonMouseDownOrUp = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
    }, [])

    useEffect(() => {
        setSelected(appSnap.currentChatId === chatSnap.id)
    }, [appSnap, chatSnap]);

    return (
        <div
            className="relative flex items-center justify-between gap-1"
            onMouseOver={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            onMouseDown={onContainerMouseDownOrUp}
            onMouseUp={onContainerMouseDownOrUp}
            onMouseEnter={onMouseEnter}
        >

            <div
                className={cx("w-full px-1 flex h-14 font-medium  rounded-lg",
                    "transition-all duration-100 hover:bg-neutral-100 hover:bg-opacity-70 bg-white",
                    selected ? "bg-opacity-90" : "bg-opacity-40")
                }
            >
                <TalkAvatar id={chatSnap.id}/>
                <div className="flex flex-col py-1 pr-10 pl-3 text-neutral-800 gap-y-0.5 overflow-hidden">
                    <div className="">
                        <p className="truncate ... break-keep">{chatSnap.name}</p>
                    </div>
                    <div className="">
                        <div className="text-sm text-neutral-600 truncate ...">
                            <Preview chatSnap={chatSnap}/>
                        </div>
                    </div>
                </div>
            </div>
            {over && <div
                className="absolute right-2 rounded-lg text-neutral-500 p-0.5 hover:bg-neutral-500/[0.4] hover:text-neutral-100"
                onMouseDown={onDeleteButtonMouseDownOrUp}
                onMouseUp={onDeleteButtonMouseDownOrUp}
                onClick={removeChat}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                     stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>}

        </div>
    )
}
