import {useCallback, useEffect, useRef} from "react";
import {useSnapshot} from "valtio/react";
import {proxy} from "valtio";
import _ from "lodash"
import {PiPlusLight} from "react-icons/pi";
import {CiSearch} from "react-icons/ci";
import {appState, Chat} from "../../../state/app-state.ts";
import {randomHash16Char} from "../../../util/util.tsx";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DraggableChat} from "./draggable-chat.tsx";

export const ChatList = () => {
    const {currentChatId, chats} = useSnapshot(appState)
    const chatRef = useRef<HTMLDivElement>(null)

    const newChat = useCallback((): void => {
        const optionClone = _.cloneDeep(appState.option)
        const chat = proxy<Chat>({
            id: randomHash16Char(),
            name: "New Chat",
            // name: "New Chat",
            messages: [],
            option: optionClone,
            inputText: ""
        })
        appState.chats.push(chat)
        appState.currentChatId = chat.id
    }, [])

    // delete other chats should not trigger auto scrolling
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            })
        }
    }, [currentChatId])

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
                className="h-full w-full overflow-y-auto pr-1 scrollbar-hidden hover:scrollbar-visible">
                <div
                    className="flex cursor-pointer flex-col gap-1">
                    <DndProvider backend={HTML5Backend}>
                        {chats.map((chatSnap, index) =>
                            <div ref={chatSnap.id === currentChatId ? chatRef : undefined}
                                 key={chatSnap.id}>
                                <DraggableChat chatSnap={chatSnap as Chat} index={index}/>
                            </div>
                        )}
                    </DndProvider>
                </div>
            </div>
        </div>
    )
}