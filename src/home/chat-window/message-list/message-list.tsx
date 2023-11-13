import React, {useEffect, useRef, useState} from "react"
import {appState, Chat} from "../../../state/app-state.ts"
import {isAttached, Message} from "../../../data-structure/message.tsx"
import ErrorBoundary from "../compnent/error-boundary.tsx"
import {maxLoadedVoice} from "../../../config.ts"
import {cx} from "../../../util/util.tsx"
import {useSnapshot} from "valtio/react"
import {addToPlayList, clearPlayList, controlState} from "../../../state/control-state.ts"
import {HiOutlineChevronDown} from "react-icons/hi2"
import {Row} from "./row.tsx"
import {subscribeKey} from "valtio/utils";
import {subscribe} from "valtio";
import {layoutState} from "../../../state/layout-state.ts";
import {clearMessageState, setMState} from "../../../state/message-state.ts";
import {useVirtualizer} from "@tanstack/react-virtual";
import {throttle} from "lodash";

type MLProps = {
    chatProxy: Chat
}

export const MessageList: React.FC<MLProps> = ({chatProxy}) => {
    // console.info("MessageList rendered", new Date().toLocaleString())
    const {sendingMessageSignal} = useSnapshot(controlState)
    const [messages, setMessages] = useState<Message[]>([])
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollEndRef = useRef<HTMLDivElement>(null)

    const lastState = useRef<{ id: string, updatedAt: number, audioDuration: number }>({
        id: "",
        updatedAt: 0,
        audioDuration: 0
    })

    useEffect(() => {
        const callBack = () => {
            setMessages(chatProxy.messages
                .filter(it => it.status !== 'deleted')
            )
        }
        const un = subscribeKey(chatProxy.messages, "length", callBack)
        callBack()
        return un
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const count = messages.length
    const virtualizer = useVirtualizer({
        count: messages.length,
        overscan: 20,
        onChange: (v) => {
            if (v.scrollElement) {
                layoutState.isMessageListOverflow = v.scrollElement.scrollHeight > v.scrollElement.clientHeight
                const {scrollTop, scrollHeight, clientHeight} = v.scrollElement
                layoutState.isMessageListAtBottom = scrollTop + clientHeight >= scrollHeight - 50
            }
        },
        getScrollElement: () => containerRef.current,
        estimateSize: () => 100,
    })
    const items = virtualizer.getVirtualItems()

    const scrollToBottom = throttle((behavior?: 'instant' | 'smooth') => {
        if (!layoutState.isPAPinning && !layoutState.isPAFloating && scrollEndRef.current) {
            // don't scroll message list if UI of Preview is showing, in case UI of Preview is pushed outside screen.
            scrollEndRef.current.scrollIntoView({behavior: behavior ?? "instant"})
        }
    }, 200)

    useEffect(() => {
        const to = setTimeout(() => scrollToBottom(), 20)
        return () => clearTimeout(to)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendingMessageSignal]);

    useEffect(() => {
        return subscribe(chatProxy.messages, () => {
            const len = chatProxy.messages.length
            if (len > 0) {
                const msg = chatProxy.messages[len - 1]
                if (lastState.current.id !== "") {
                    if (msg.id !== lastState.current.id ||
                        msg.lastUpdatedAt > lastState.current.updatedAt ||
                        (msg.audio?.durationMs ?? 0) > lastState.current.audioDuration
                    ) {
                        if (layoutState.isMessageListAtBottom) {
                            // Avoid using virtualizer.scrollToIndex for scrolling, as it doesn't perform optimally in dynamic mode
                            scrollToBottom("smooth")
                        }
                    }
                    // Limitation: In the event of multiple simultaneous audio arrivals, only the most recent audio may
                    // have an opportunity to be added to the playlist
                    if (msg.id === lastState.current.id &&
                        msg.role === "assistant" &&
                        msg.audio &&
                        (msg.audio.durationMs ?? 0) > lastState.current.audioDuration
                    ) {
                        addToPlayList(msg.audio.id)
                    }
                }
                lastState.current = ({
                    id: msg.id,
                    updatedAt: msg.lastUpdatedAt,
                    audioDuration: msg.audio?.durationMs ?? 0
                })
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return () => clearPlayList()
    }, [])

    // whether text is attached or should load audio
    useEffect(() => {
        const callback = () => {
            const mh = appState.pref.butterflyOnAttachedMessage ? chatProxy.option.llm.maxAttached : 0
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
                    if (isAttached(m)) {
                        setMState(m.id, "attached", true)
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
        const un2 = subscribeKey(chatProxy.option.llm, 'maxAttached', callback)
        const un3 = subscribeKey(appState.pref, 'butterflyOnAttachedMessage', callback)
        callback()
        return () => {
            un1()
            un2()
            un3()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // only scroll to bottom once
        if (count > 0 && lastState.current.id === "") {
            // It is recommended to use virtualizer.scrollToIndex instead of scrollToBottom as the latter may not be
            // accurate until the virtualizer has fully initialized.
            virtualizer.scrollToIndex(count - 1, {align: "end"})
        }
    }, [count, virtualizer])

    return (
        <div ref={containerRef}
             style={{scrollbarGutter: "stable"}}
             className="w-full overflow-y-auto scrollbar-hidden hover:scrollbar-visible pl-2 pr-1">
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${items[0]?.start ?? 0}px)`,
                    }}
                >
                    {items.map((virtualRow) => (
                        <div
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            // message of the same ticket stay closer
                            className={
                                messages[virtualRow.index - 1]?.ticketId === messages[virtualRow.index].ticketId &&
                                messages[virtualRow.index - 1]?.role === messages[virtualRow.index].role
                                    ? "pt-[2px]" : "pt-5"
                            }
                        >
                            <ErrorBoundary>
                                <Row chatId={chatProxy.id}
                                     messageProxy={messages[virtualRow.index]}
                                />
                            </ErrorBoundary>
                        </div>
                    ))}
                </div>
            </div>
            <div ref={scrollEndRef}></div>
            <ToBottomButton action={() =>
                virtualizer.scrollToIndex(count - 1, {align: "end", behavior: "smooth"})
            }/>
        </div>
    )
}

type TBProps = {
    action: () => void
}
const ToBottomButton: React.FC<TBProps> = ({action}) => {
    const {isMessageListOverflow, isMessageListAtBottom} = useSnapshot(layoutState)

    return <div className="sticky bottom-1 flex justify-end pr-3">
        <div className="relative">
            <HiOutlineChevronDown
                className={cx("absolute right-0 bottom-0 h-8 w-8 p-1.5 bg-neutral-100 rounded-full",
                    isMessageListOverflow && !isMessageListAtBottom ? "" : "hidden")}
                onClick={action}
            />
        </div>
    </div>
}