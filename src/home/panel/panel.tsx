import React, {useCallback, useEffect, useState} from 'react';
import {useSnapshot} from "valtio/react";
import {appState, Chat, PanelSelection} from "../../state/app-state.ts";
import {controlState} from "../../state/control-state.ts";
import {ChatList} from "./chat-list/chat-list.tsx";
import {cx, escapeSpaceKey} from "../../util/util.tsx";
import {Global} from "./global/global.tsx";
import {Current} from "./current/current.tsx";
import {layoutState} from "../../state/layout-state.ts";

export const Panel: React.FC = () => {

    const appSnap = useSnapshot(appState)
    const [chatProxy, setChatProxy] = useState<Chat>()

    useEffect(() => {
        if (appSnap.currentChatId) {
            setChatProxy(appState.chats[appState.currentChatId] as Chat)
        }
    }, [appSnap.currentChatId, appSnap.chats]);

    const onMouseUpOrDown = useCallback((p: PanelSelection) => {
        appState.panelSelection = p
    }, [])

    const onMouseEnter = useCallback((p: PanelSelection) => {
        if (controlState.isMouseLeftDown) {
            appState.panelSelection = p
        }
    }, [])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop
        console.debug("scrollTop", scrollTop)
        layoutState.settingPanelScrollOffset = scrollTop
    };

    return (
        <div className="flex h-full select-none flex-col gap-3 w-full"
             onKeyDown={escapeSpaceKey}
        >
            <div className="flex items-center rounded-xl font-medium min-h-12  gap-y-2
            p-1 bg-white bg-opacity-40">
                <div
                    className={cx("flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        appSnap.panelSelection === "chats" ? "bg-white/[0.8]" : "hover:bg-white/[0.4]")}
                    onMouseUp={() => onMouseUpOrDown("chats")}
                    onMouseDown={() => onMouseUpOrDown("chats")}
                    onMouseEnter={() => onMouseEnter("chats")}
                >
                    <p className="text-center">Chats</p>
                </div>
                <div
                    className={cx("flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        appSnap.panelSelection === "global" ? "bg-white/[0.8]" : "hover:bg-white/[0.4]")}
                    onMouseUp={() => onMouseUpOrDown("global")}
                    onMouseDown={() => onMouseUpOrDown("global")}
                    onMouseEnter={() => onMouseEnter("global")}
                >
                    <p className="text-center">Setting</p>
                </div>
                <div className={
                    cx(
                        "flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        appSnap.currentChatId === "" ? "hidden" : "",
                        appSnap.panelSelection === "current" ? "bg-white bg-opacity-80" : "hover:bg-white/[0.4]"
                    )}
                     onMouseUp={() => onMouseUpOrDown("current")}
                     onMouseDown={() => onMouseUpOrDown("current")}
                     onMouseEnter={() => onMouseEnter("current")}
                >
                    <p className="text-center">Current</p>
                </div>
            </div>

            {/* utilizing hidden to avoid flashing animation on panel selection*/}
            <div
                onScroll={handleScroll}
                className={cx(
                    "flex flex-col gap-y-3 items-center overflow-y-auto pr-1",
                    appSnap.panelSelection !== "chats" && "hidden"
                )}
            >
                <ChatList/>
            </div>

            <div
                onScroll={handleScroll}
                className={cx(
                    "flex flex-col gap-y-3 items-center overflow-y-auto pr-1",
                    appSnap.panelSelection !== "global" && "hidden"
                )}
            >
                <Global optionProxy={appState.option}/>
            </div>
            <div
                onScroll={handleScroll}
                className={cx(
                    "flex flex-col gap-y-3 items-center overflow-y-auto pr-1",
                    appSnap.panelSelection !== "current" && "hidden"
                )}
            >
                {chatProxy &&
                    <Current chatProxy={chatProxy}/>
                }
            </div>
        </div>
    )
}