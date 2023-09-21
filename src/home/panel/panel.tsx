/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useState} from 'react';
import {useSnapshot} from "valtio/react";
import {appState, PanelSelection} from "../../state/app-state.ts";
import {ChatList} from "./chat-list/chat-list.tsx";
import {cx, escapeSpaceKey} from "../../util/util.tsx";
import {Global} from "./global/global.tsx";
import {Current} from "./current/current.tsx";
import {layoutState} from "../../state/layout-state.ts";

export const Panel: React.FC = () => {

    const {currentChatId, panelSelection} = useSnapshot(appState)
    const [isMouseDown, setIsMouseDown] = useState(false)

    const onMouseUpOrDown = useCallback((p: PanelSelection) => {
        appState.panelSelection = p
    }, [])

    const onMouseEnter = useCallback((p: PanelSelection) => {
        if (isMouseDown) {
            appState.panelSelection = p
        }
    }, [isMouseDown])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        layoutState.settingPanelScrollOffset = e.currentTarget.scrollTop
    };

    return (
        <div className="flex h-full select-none flex-col gap-3 w-full"
             onKeyDown={escapeSpaceKey}
             onMouseDown={() => setIsMouseDown(true)}
             onMouseUp={() => setIsMouseDown(false)}
             onMouseLeave={() => setIsMouseDown(false)}
             onBlur={() => setIsMouseDown(false)}
        >
            <div className="flex items-center rounded-xl font-medium min-h-12  gap-y-2
            p-1 bg-white bg-opacity-40">
                <div
                    className={cx("flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        panelSelection === "chats" ? "bg-white/[0.8]" : "hover:bg-white/[0.4]")}
                    onMouseUp={() => onMouseUpOrDown("chats")}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        onMouseUpOrDown("chats")
                    }}
                    onMouseEnter={() => onMouseEnter("chats")}
                >
                    <p className="text-center">Chats</p>
                </div>
                <div
                    className={cx("flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        panelSelection === "global" ? "bg-white/[0.8]" : "hover:bg-white/[0.4]")}
                    onMouseUp={() => onMouseUpOrDown("global")}
                    onMouseDown={() => onMouseUpOrDown("global")}
                    onMouseEnter={() => onMouseEnter("global")}
                >
                    <p className="text-center">Global</p>
                </div>
                <div className={
                    cx(
                        "flex w-1/3 justify-center items-center h-full rounded-lg transition-all duration-150",
                        currentChatId === "" ? "hidden" : "",
                        panelSelection === "current" ? "bg-white bg-opacity-80" : "hover:bg-white/[0.4]"
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
                    panelSelection !== "chats" && "hidden"
                )}
            >
                <ChatList/>
            </div>

            <div
                onScroll={handleScroll}
                className={cx(
                    "flex flex-col gap-y-3 items-center overflow-y-auto pr-1",
                    panelSelection !== "global" && "hidden"
                )}
            >
                <Global optionProxy={appState.option}/>
                {ninjia}
            </div>
            <div
                onScroll={handleScroll}
                className={cx(
                    "flex flex-col gap-y-3 items-center overflow-y-auto pr-1",
                    panelSelection !== "current" && "hidden"
                )}
            >
                {currentChatId !== "" &&
                    <Current/>
                }
                {ninjia}
            </div>
        </div>
    )
}

const ninjia = <div className="min-h-[14rem] text-transparent select-none pointer-events-none" data-pseudo-content="ninja"></div>