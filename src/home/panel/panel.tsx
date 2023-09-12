import React, {useCallback, useEffect, useState} from 'react';
import {useSnapshot} from "valtio/react";
import {appState, Chat, PanelSelection} from "../../state/app-state.ts";
import {controlState} from "../../state/control-state.ts";
import {ChatList} from "./chat-list/chat-list.tsx";
import {OtherSetting} from "./current/other-setting.tsx";
import {escapeSpaceKey, cx} from "../../util/util.tsx";
import {Global} from "./global/global.tsx";

export const Panel: React.FC = () => {

    const controlSnp = useSnapshot(controlState)
    const appSnp = useSnapshot(appState)
    const [chatProxy, setChatProxy] = useState<Chat>()

    useEffect(() => {
        if (appSnp.currentChatId) {
            setChatProxy(appState.chats[appSnp.currentChatId] as Chat)
        }
    }, [appSnp.currentChatId]);

    const onMouseUp = useCallback((p: PanelSelection) => {
        appState.panelSelection = p
    }, [])

    const onMouseDown = useCallback((p: PanelSelection) => {
        appState.panelSelection = p
    }, [])

    const onMouseEnter = useCallback((p: PanelSelection) => {
        if (controlSnp.isMouseLeftDown) {
            appState.panelSelection = p
        }
    }, [controlSnp])

    return (
        <div className="flex h-full select-none flex-col gap-3 w-full"
             onKeyDown={escapeSpaceKey}
        >
            <div className="flex items-center rounded-xl font-medium min-h-12  gap-y-2
            p-1 bg-white bg-opacity-40">
                <div
                    className={cx("flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        appSnp.panelSelection === "chats" ? "bg-white/[0.8]" : "hover:bg-white/[0.4]")}
                    onMouseUp={() => onMouseUp("chats")}
                    onMouseDown={() => onMouseDown("chats")}
                    onMouseEnter={() => onMouseEnter("chats")}
                >
                    <p className="text-center">Chats</p>
                </div>
                <div
                    className={cx("flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        appSnp.panelSelection === "global" ? "bg-white/[0.8]" : "hover:bg-white/[0.4]")}
                    onMouseUp={() => onMouseUp("global")}
                    onMouseDown={() => onMouseDown("global")}
                    onMouseEnter={() => onMouseEnter("global")}
                >
                    <p className="text-center">Setting</p>
                </div>
                <div className={
                    cx(
                        "flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        appSnp.currentChatId === "" ? "hidden" : "",
                        appSnp.panelSelection === "current" ? "bg-white bg-opacity-80" : "hover:bg-white/[0.4]"
                    )}
                     onMouseUp={() => onMouseUp("current")}
                     onMouseDown={() => onMouseDown("current")}
                     onMouseEnter={() => onMouseEnter("current")}
                >
                    <p className="text-center">Current</p>
                </div>
            </div>
            <div className="flex flex-col gap-y-3 items-center overflow-y-auto pr-1"
            >
                {appSnp.panelSelection === "chats" &&
                    <ChatList/>
                }
                {appSnp.panelSelection === "global" &&
                    <Global/>
                }
                {appSnp.panelSelection === "current" && chatProxy &&
                    <>
                        <OtherSetting chatProxy={chatProxy}/>
                    </>
                }
            </div>
        </div>
    )
}