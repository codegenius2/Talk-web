import React, {useCallback, useEffect, useRef, useState} from "react"
import {useSnapshot} from "valtio/react"
import {appState, Chat, deleteChat} from "../../../state/app-state.ts"
import {Preview} from "./preview.tsx"
import {cx} from "../../../util/util.tsx"
import {TalkAvatar} from "./avatar.tsx"
import {controlState} from "../../../state/control-state.ts"

type Props = {
    chatProxy: Chat
}

export const ChatComponent: React.FC<Props> = ({chatProxy}) => {
    // console.info("ChatComponent rendered, chatId", chatProxy.id, new Date().toLocaleString())

    const {name} = useSnapshot(chatProxy)
    const {currentChatId} = useSnapshot(appState)
    const [selected, setSelected] = useState(false)
    const [over, setMouseOver] = useState(false)
    const {isMouseDragging} = useSnapshot(controlState)
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState("")
    const editorRef = useRef<HTMLInputElement>(null)

    const onClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        appState.currentChatId = chatProxy.id
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const removeChat = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        deleteChat(chatProxy.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onDeleteButtonMouseDownOrUp = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
    }, [])

    useEffect(() => {
        setSelected(currentChatId === chatProxy.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChatId])

    const startEditing = useCallback(() => {
        if (selected) {
            setEditText(chatProxy.name)
            setIsEditing(true)
        }
        const to = setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.select()
            }
        }, 20)
        return () => clearTimeout(to)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    const doneEditing = useCallback(() => {
        const text = editText.trim()
        if (text !== "") {
            chatProxy.name = editText
        }
        setIsEditing(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editText])

    const keyDownOnEditing = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === "Escape") {
            doneEditing()
            e.stopPropagation()
        } else if (e.key === "Tab") {
            e.preventDefault()
        }
    }, [doneEditing])

    return (
        <div
            className="relative flex items-center justify-between gap-1"
            onMouseOver={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            onClick={onClick}
        >

            <div
                className={cx("w-full px-1 flex h-14 font-medium rounded-lg",
                    "transition-all duration-100 bg-white",
                    selected ? "bg-opacity-75" : "bg-opacity-40",
                    !isMouseDragging && !selected && "hover:bg-neutral-100 hover:bg-opacity-60"
                )
                }
            >
                <TalkAvatar id={chatProxy.id}/>
                {isEditing ?
                    <div
                        className="flex flex-col items-center justify-center overflow-hidden py-1 pl-3
                    pr-2 flex-grow text-neutral-800">
                        <input ref={editorRef}
                               name="rename chat"
                               className="w-full resize-none text-lg bg-transparent
                            text-neutral-600 outline-none prose"
                               value={editText}
                               onChange={(e) => {
                                   setEditText(e.target.value)
                               }}
                               onKeyDown={keyDownOnEditing}
                               onBlur={doneEditing}
                        >
                        </input>
                    </div> :
                    <div className="flex flex-col overflow-hidden py-1 pr-10 pl-3 text-neutral-800 gap-y-0.5">

                        <div className=""
                             onClick={startEditing}
                        >
                            <p className="truncate ... break-keep">{name}</p>
                        </div>
                        <div className="">
                            <div className="truncate text-sm text-neutral-600 ...">
                                <Preview chatProxy={chatProxy}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {
                !isEditing && !isMouseDragging && over && <div
                    className="absolute right-2 rounded-lg text-neutral-500 p-0.5 hover:bg-neutral-500/[0.4] hover:text-neutral-100"
                    onMouseDown={onDeleteButtonMouseDownOrUp}
                    onMouseUp={onDeleteButtonMouseDownOrUp}
                    onClick={removeChat}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                         stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
            }
        </div>
    )
}
