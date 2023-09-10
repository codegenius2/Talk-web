import {useCallback} from "react";
import {useSnapshot} from "valtio/react";
import {proxy} from "valtio";
import _ from "lodash"
import {PiPlusLight} from "react-icons/pi";
import {CiSearch} from "react-icons/ci";
import {appState, Chat} from "../../state/app-state.ts";
import {ClientAbility} from "../../state/data-structure/client-ability/client-ability.tsx";
import {randomHash16Char} from "../../util/util.tsx";
import {ChatComponent} from "./chat-component.tsx";

export const ChatList = () => {
    const appSnp = useSnapshot(appState)

    const newChat = useCallback((): void => {
        const abilityClone = _.cloneDeep(appSnp.ability) as ClientAbility
        const chat = proxy<Chat>({
            id: randomHash16Char(),
            name: randomHash16Char(),
            // name: "New Chat",
            messages: [],
            ability: abilityClone,
            inputText: ""
        })
        appState.chats[chat.id] = chat
        appState.currentChatId = chat.id
    }, [appSnp.ability])

    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <div
                    className="mr-auto flex w-full items-center justify-center gap-2 rounded-xl bg-white bg-opacity-40 backdrop-blur">
                    <CiSearch/>
                    <p className="text-neutral-600 prose">Search</p>
                </div>
                <div
                    className="flex justify-center items-center rounded-xl stroke-white text-neutral-500
                 bg-white bg-opacity-80 backdrop-blur cursor-pointer"
                    onClick={newChat}>
                    <PiPlusLight size={24}/>
                </div>
            </div>
            <div
                className="h-full w-full overflow-y-auto pr-1 scrollbar-hide hover:scrollbar-show">
                <div
                    className="flex cursor-pointer flex-col gap-1">
                    {Object.entries(appSnp.chats).map(([key, chatSnp]) =>
                        <ChatComponent chatSnp={chatSnp as Chat} key={key}/>
                    )}
                </div>
            </div>
        </div>
    )
}