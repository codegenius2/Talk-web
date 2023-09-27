import React, {memo, useCallback, useEffect, useRef, useState} from "react"
import {useSnapshot} from "valtio/react"
import {proxy, subscribe} from "valtio"
import _ from "lodash"
import {PiPlusLight} from "react-icons/pi"
import {CiSearch} from "react-icons/ci"
import {appState, Chat} from "../../../state/app-state.ts"
import {randomHash16Char} from "../../../util/util.tsx"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {DraggableChat} from "./draggable-chat.tsx"
import {motion} from "framer-motion"

const animation = {
    x: [0, -10, 10, -10, 10, 0],
    y: [0, 0, 0, 0, 0, 0],
}

const ChatList_ = () => {
    const {currentChatId} = useSnapshot(appState)
    const chatRef = useRef<HTMLDivElement>(null)
    const [chats, setChats] = useState<Chat[]>([])
    const [showSearch, setShowSearch] = useState(true)

    useEffect(() => {
        const callback = () => {
            // only rerender when chat list size changed, or reordering happened(triggered by drag and drop)
            // never rerender the whole chat list when chat message changes
            if (appState.chats.length !== chats.length) {
                setChats(appState.chats.slice())
            } else {
                for (let i = 0; i < chats.length; i++) {
                    if (appState.chats[i]?.id != chats[i].id) {
                        setChats(appState.chats.slice())
                        return
                    }
                }
            }
        }
        const unsubscribe = subscribe(appState.chats, callback)
        callback()
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chats.length])

    const newChat = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        const optionClone = _.cloneDeep(appState.option)
        const chat = proxy<Chat>({
            id: randomHash16Char(),
            name: "New Chat",
            promptId: "",
            messages: [],
            option: optionClone,
            inputText: ""
        })
        appState.chats.push(chat)
        appState.currentChatId = chat.id
    }, [])

    // delete other chats should not trigger auto scrolling
    useEffect(() => {
        setTimeout(() => {
                if (chatRef.current) {
                    chatRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    })
                }
            }
        )
    }, [currentChatId])

    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <div
                    onClick={() => setShowSearch(!showSearch)}
                    className="mr-auto flex w-full items-center justify-center gap-2 rounded-xl bg-white bg-opacity-40 backdrop-blur">
                    {showSearch && <CiSearch/>}
                    {showSearch && <p className="text-neutral-600 prose">Search</p>}
                    {!showSearch &&
                        <motion.p
                            animate={animation}
                            transition={{stiffness: 300, damping: 30}}
                            className="text-neutral-600 prose">
                            Come see me in '24 😬
                        </motion.p>
                    }
                </div>
                <div
                    className="flex justify-center items-center rounded-xl stroke-white text-neutral-500
                 bg-white bg-opacity-80 backdrop-blur cursor-pointer"
                    onClick={newChat}
                    onMouseDown={e => e.stopPropagation()}
                    onMouseUp={e => e.stopPropagation()}
                >
                    <PiPlusLight size={24}/>
                </div>
            </div>
            <div
                className="h-full w-full overflow-y-auto pr-1 scrollbar-hidden hover:scrollbar-visible">
                <div
                    className="flex cursor-pointer flex-col gap-1">
                    <DndProvider backend={HTML5Backend}>
                        {chats.map((chatProxy, index) =>
                            <div ref={chatProxy.id === currentChatId ? chatRef : undefined}
                                 key={chatProxy.id}>
                                <DraggableChat chatProxy={chatProxy} index={index}/>
                            </div>
                        )}
                    </DndProvider>
                </div>
            </div>
        </div>
    )
}

export const ChatList = memo(ChatList_)