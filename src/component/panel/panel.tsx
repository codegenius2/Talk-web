import React, {useCallback, useEffect, useState} from 'react';
import {ClientAbility} from "../../data-structure/ability/client-ability.tsx";
import {useSettingStore} from "../../state/setting.ts";
import {escapeSpaceKey, joinClasses} from "../../util/util.tsx";
import {Chat, useChatStore} from "../../state/chat.tsx";
import {useLayoutStore} from "../../state/layout.ts";
import {useMouseStore} from "../../state/mouse.tsx";
import {ChatList} from "./chat/chat-list.tsx";
import {AbilitySetting} from "./setting/ability/ability-setting.tsx";
import {GlobalSetting} from "./setting/global-setting.tsx";
import {CurrentSetting} from "./setting/current-setting.tsx";

export const Panel: React.FC = () => {

    const isMouseDown = useMouseStore(state => state.isMouseDown)
    const panel = useLayoutStore(state => state.panel)
    const setPanel = useLayoutStore(state => state.setPanel)

    const globalAbility = useSettingStore(state => state.ability)
    const setGlobalAbility = useSettingStore(state => state.setAbility)

    const currentChatId = useChatStore(state => state.currentChatId)
    const getCurrentChat = useChatStore(state => state.getCurrentChat)
    const lastUpdate = useChatStore(state => state.lastUpdate)
    const getChatAbility = useChatStore(state => state.getAbility)
    const setChatAbility = useChatStore(state => state.setAbility)
    // the above const values don't observe on chatAbility, use chatAbilityChanged to trigger re-render
    const [chatAbilityChanged, setChatAbilityChanged] = useState(0)


    const [currentChat, setCurrentChat] = useState<Chat | undefined>(undefined)

    useEffect(() => {
        setCurrentChat(getCurrentChat())
    }, [getCurrentChat, lastUpdate, currentChatId]);

    const setChatAbility_ = useCallback((ability: ClientAbility) => {
        setChatAbility(currentChatId!, ability)
        setChatAbilityChanged(chatAbilityChanged + 1)
    }, [chatAbilityChanged, currentChatId, setChatAbility])

    let panelContent = null
    let chatAbility
    switch (panel) {
        case "chats":
            panelContent = <ChatList/>
            break;
        case "global":
            panelContent = (<>
                <AbilitySetting setAbility={setGlobalAbility} ability={globalAbility}/>
                <GlobalSetting/>
            </>)
            break;
        case "current":
            if (!currentChatId) {
                console.error("currentChatId mustn't be empty, currentChatId", currentChatId)
                break
            }
            chatAbility = getChatAbility(currentChatId);
            if (!chatAbility) {
                console.error("chatAbility mustn't be empty, currentChatId", currentChatId)
                break
            }
            panelContent = (
                <>
                    <AbilitySetting setAbility={setChatAbility_} ability={chatAbility}/>
                    <CurrentSetting chatId={currentChatId!}/>
                </>
            )
            break;
    }

    return (
        <div className="flex flex-col gap-3 w-full h-full overflow-y-hidden select-none">
            <div className="flex items-center rounded-xl font-medium min-h-12
            p-1 gap-1 bg-white bg-opacity-40">
                <div
                    className={joinClasses("flex w-1/3 justify-center items-center h-full rounded-lg",
                        panel === "chats" ? "bg-white/[0.8]" : "hover:bg-white/[0.4]")}
                    onMouseDown={() => setPanel("chats")}
                    onMouseUp={() => setPanel("chats")}
                    onMouseEnter={() => isMouseDown && setPanel("chats")}
                >
                    <p className="text-center">Chats</p>
                </div>
                <div
                    className={joinClasses("flex w-1/3 justify-center items-center h-full rounded-lg",
                        panel === "global" ? "bg-white/[0.8]" : "hover:bg-white/[0.4]")}
                    onMouseDown={() => setPanel("global")}
                    onMouseUp={() => setPanel("global")}
                    onMouseEnter={() => isMouseDown && setPanel("global")}
                >
                    <p className="text-center">Setting</p>
                </div>
                <div className={
                    joinClasses(
                        "flex w-1/3 justify-center items-center h-full rounded-lg",
                        currentChat === undefined ? "hidden" : "",
                        panel === "current" ? "bg-white bg-opacity-80" : "hover:bg-white/[0.4]"
                    )}
                     onMouseDown={() => setPanel("current")}
                     onMouseUp={() => setPanel("current")}
                     onMouseEnter={() => isMouseDown && setPanel("current")}
                >
                    <p className="text-center">Current</p>
                </div>
            </div>
            <div className="flex flex-col w-full h-full items-center gap-2"
                 onKeyDown={escapeSpaceKey}
            >
                {panelContent}
            </div>
        </div>
    )
}