import React, {useCallback, useEffect, useRef, useState} from "react"
import {appState, Chat} from "../../../state/app-state.ts"
import {isInHistory, Message} from "../../../data-structure/message.tsx"
import ErrorBoundary from "../compnent/error-boundary.tsx"
import {maxLoadedVoice} from "../../../config.ts"
import {cx} from "../../../util/util.tsx"
import {useSnapshot} from "valtio/react"
import {addToPlayList, clearPlayList} from "../../../state/control-state.ts"
import {HiOutlineChevronDown} from "react-icons/hi2"
import {Row} from "./row.tsx"
import {subscribeKey} from "valtio/utils";
import {subscribe} from "valtio";
import {layoutState} from "../../../state/layout-state.ts";
import {clearMessageState, setMState} from "../../../state/message-state.ts";

type MLProps = {
    chatProxy: Chat
}

export const MessageList: React.FC<MLProps> = ({chatProxy}) => {
    // console.info("MessageList rendered", new Date().toLocaleString())
    const [messages, setMessages] = useState<Message[]>([])
    const scrollEndRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const lastState = useRef<{ id: string, updatedAt: number }>({id: "", updatedAt: 0})

    useEffect(() => {
        const callBack = () => {
            console.info("length changed, should rerender", new Date().toLocaleString())
            setMessages(chatProxy.messages.slice())
        }
        const un = subscribeKey(chatProxy.messages, "length", callBack)
        callBack()
        return un
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const scrollToBottom = useCallback((behavior?: 'instant' | 'smooth') => {
        if (scrollEndRef.current) {
            scrollEndRef.current.scrollIntoView({behavior: behavior ?? "instant"})
        }
    }, [])

    useEffect(() => {
        setTimeout(() => {
            console.info(
                "message length when scrolling:", chatProxy.messages.length)

            scrollToBottom()
        }, 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (containerRef.current) {
                layoutState.isMessageListOverflow = containerRef.current.scrollHeight > containerRef.current.clientHeight
            }
        })

        if (containerRef.current) {
            observer.observe(containerRef.current, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                attributeFilter: ['style', 'class'],
            })
        }
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const container = containerRef.current

        const handleScroll = () => {
            if (container) {
                const {scrollTop, scrollHeight, clientHeight} = container
                layoutState.isMessageListAtBottom = scrollTop + clientHeight >= scrollHeight - 200
            }
        }

        container?.addEventListener('scroll', handleScroll)

        return () => {
            container?.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        subscribe(chatProxy.messages, () => {
            const len = chatProxy.messages.length
            if (len > 0) {
                const msg = chatProxy.messages[len - 1]
                if (lastState.current.id !== "") {
                    if (msg.id !== lastState.current.id ||
                        msg.lastUpdatedAt > lastState.current.updatedAt) {
                        if (scrollEndRef.current && layoutState.isMessageListAtBottom) {
                            scrollEndRef.current.scrollIntoView({behavior: 'instant'})
                        }
                        if (msg.audio?.id && msg.status === "received") {
                            addToPlayList(msg.audio.id)
                        }
                    }
                }
                lastState.current = ({id: msg.id, updatedAt: msg.lastUpdatedAt})
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return () => clearPlayList()
    }, [])

    // whether text in history or should load audio
    useEffect(() => {
        const callback = () => {
            const mh = appState.pref.butterflyOnHistoryMessage ? chatProxy.option.llm.maxHistory : 0
            let histCount = 0
            let loadCount = 0
            clearMessageState()
            for (let i = chatProxy.messages.length - 1; i >= 0; i--) {
                if (histCount >= mh && loadCount >= maxLoadedVoice) {
                    break
                }
                const m = chatProxy.messages[i]
                if (m.status === 'deleted') {
                    continue
                }
                if (histCount < mh) {
                    if (isInHistory(m)) {
                        setMState(m.id, "inHistory", true)
                        histCount++
                    }
                }
                if (loadCount < maxLoadedVoice) {
                    const audio = m.audio
                    if (audio?.id) {
                        setMState(m.id, "loadAudio", true)
                        loadCount++
                    }
                }
            }
        }
        const un1 = subscribe(chatProxy.messages, callback)
        const un2 = subscribeKey(chatProxy.option.llm, 'maxHistory', callback)
        const un3 = subscribeKey(appState.pref, 'butterflyOnHistoryMessage', callback)
        callback()
        return () => {
            un1()
            un2()
            un3()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const buttonScrollAction = useCallback(() => {
        scrollToBottom("smooth")
    }, [scrollToBottom]);

    return (
        <div ref={containerRef}
             className="w-full overflow-y-auto pr-1 scrollbar-hidden hover:scrollbar-visible">
            <div className="flex w-full select-text flex-col justify-end gap-3 rounded-2xl">
                {/*crucial; don't merge the 2 divs above*/}
                {messages.map((msg) =>
                    msg.status !== 'deleted' &&
                    <ErrorBoundary key={msg.id}>
                        <Row chatId={chatProxy.id}
                             messageProxy={msg}
                        />
                    </ErrorBoundary>
                )}
            </div>
            <div
                ref={scrollEndRef}
                className="h-10 select-none bg-transparent text-transparent" data-pseudo-content="ninja"/>
            <ToBottomButton action={buttonScrollAction}/>
        </div>
    )
}

type TBProps = {
    action: () => void
}
const ToBottomButton: React.FC<TBProps> = ({action}) => {
    const {isMessageListOverflow, isMessageListAtBottom} = useSnapshot(layoutState)

    return <div className="sticky bottom-1 flex justify-end pr-3 z-40">
        <HiOutlineChevronDown
            className={cx("h-8 w-8 p-1.5 bg-neutral-100 rounded-full",
                isMessageListOverflow && !isMessageListAtBottom ? "" : "hidden")}
            onClick={action}
        />
    </div>
}