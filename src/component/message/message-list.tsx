import React, {useCallback, useEffect, useRef, useState} from "react";
import ErrorBoundary from ".././error-boundary.tsx";
import {isInHistory, Message, onDelete} from "../../data-structure/message.tsx";
import {maxHistory} from "../../data-structure/ability/llm.ts";
import {maxLoadedVoice} from "../../config.ts";
import {RichOpText} from "./rich-op-text.tsx";
import {Audio as MyAudio} from "./audio.tsx"
import {Chat, useChatStore} from "../../state/chat.tsx";

export const MessageList: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const getCurrentChat = useChatStore(state => state.getCurrentChat)
    const currentChatId = useChatStore(state => state.currentChatId)
    const lastUpdate = useChatStore(state => state.lastUpdate)
    const [mh, setMh] = useState(0)
    const [inHistory, setInHistory] = useState<Set<number>>(new Set())
    const [loadVoice, setLoadVoice] = useState<Set<number>>(new Set())

    const [chat, setChat] = useState<Chat | undefined>(undefined)

    useEffect(() => {
        setChat(getCurrentChat())
    }, [getCurrentChat, lastUpdate, currentChatId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current!.scrollIntoView({behavior: 'instant'})
        }
    }); // run once on mount

    useEffect(() => {
        if (!chat) {
            return
        }
        setMh(maxHistory(chat.ability.llm))
    }, [chat])

    useEffect(() => {
        if (!chat) {
            return
        }
        const ms = chat.ms
        for (let i = ms.length - 1; i >= 0; i--) {
            if (ms[i].status === 'deleted') {
                continue
            }
            if (inHistory.size >= mh && loadVoice.size >= maxLoadedVoice) {
                break
            }
            if (inHistory.size < mh) {
                if (isInHistory(ms[i])) {
                    inHistory.add(i)
                }
            }
            if (loadVoice.size >= maxLoadedVoice) {
                if (ms[i].audio) {
                    loadVoice.add(i)
                }
            }
        }
        setInHistory(inHistory)
        setLoadVoice(loadVoice)
    }, [chat, inHistory, loadVoice, mh])

    if (!chat) {
        return <div/>
    }

    return (
        <div className="overflow-y-auto overflow-x-hidden w-full scrollbar-hide hover:scrollbar-show">
            <div className="flex flex-col gap-5 rounded-lg w-full justify-end">
                {/*crucial; don't merge the 2 divs above, or sc*/}
                {chat.ms.filter(it => it.status !== 'deleted')
                    .map((m, index) =>
                        <div className="flex flex-col gap-1 mr-2" key={m.id}>
                            <Row chatId={chat.id}
                                 message={m}
                                 inHistory={inHistory.has(index)}
                                 loadAudio={loadVoice.has(index)}
                            />
                        </div>
                    )}
            </div>
            <div ref={scrollRef}/>
        </div>
    )
};

type Props = {
    chatId: string
    message: Message
    inHistory: boolean
    loadAudio: boolean
}

const Row: React.FC<Props> = ({chatId, message, inHistory, loadAudio}) => {
    const getMessage = useChatStore(state => state.getMessage)
    const replaceMessageOr = useChatStore(state => state.replaceMessageOr)

    const handleDelete = useCallback(() => {
        const prev = getMessage(chatId, message.id);
        if (!prev) {
            console.warn("failed to delete message, chatId,messageId:", chatId, message.id)
            return
        }
        const now = onDelete(prev)
        replaceMessageOr(chatId, now, "ignore")
    }, [chatId, getMessage, message.id, replaceMessageOr])

    switch (message.status) {
        case "sending":
            break;
        case "sent":
            break;
        case "thinking":
            break;
        case "typing":
            break;
        case "received":
            break;
        case "error":
            break;
    }
    let m: React.JSX.Element
    if (message.audio) {
        m = <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900 self-end">
            <MyAudio audio={message.audio} self={true} loadAudio={loadAudio}/>
        </div>
    } else {
        m = <div className={inHistory ? "border border-neutral-500 border-dashed" : ""}>
            <RichOpText deleteFunc={handleDelete} text={message.text}/>
        </div>
    }
    return <ErrorBoundary>
        {m}
    </ErrorBoundary>
}

