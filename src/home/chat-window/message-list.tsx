import React, {useCallback, useEffect, useRef, useState} from "react";
import {Chat, markMessageAsDeleted} from "../../state/app-state.ts";
import {isInHistory, Message} from "../../data-structure/message.tsx";
import {Audio} from "./message/audio.tsx";
import {RichOpText} from "./message/rich-op-text.tsx";
import ErrorBoundary from "./message/error-boundary.tsx";
import {maxLoadedVoice} from "../../config.ts";

type MLProps = {
    chatSnap: Chat
}

export const MessageList: React.FC<MLProps> = ({chatSnap}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const [shouldBeInHistory, setShouldBeInHistory] = useState<Set<number>>(new Set())
    const [shouldLoadVoice, setShouldLoadVoice] = useState<Set<number>>(new Set())

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current!.scrollIntoView({behavior: 'instant'})
        }
    }); // run once on mount

    useEffect(() => {
        const messages = chatSnap.messages
        const mh = chatSnap.option.llm.maxHistory
        for (let i = messages.length - 1; i >= 0; i--) {
            if (shouldBeInHistory.size >= mh && shouldLoadVoice.size >= maxLoadedVoice) {
                break
            }
            if (messages[i].status === 'deleted') {
                continue
            }
            if (shouldBeInHistory.size < mh) {
                if (isInHistory(messages[i])) {
                    shouldBeInHistory.add(i)
                }
            }
            if (shouldLoadVoice.size >= maxLoadedVoice) {
                if (messages[i].audio) {
                    shouldLoadVoice.add(i)
                }
            }
        }
        setShouldBeInHistory(shouldBeInHistory)
        setShouldLoadVoice(shouldLoadVoice)
    }, [chatSnap, shouldBeInHistory, shouldLoadVoice])

    return (
        <div className="overflow-y-auto w-full scrollbar-hidden hover:scrollbar-visible">
            <div className="flex flex-col gap-5 rounded-lg w-full justify-end">
                {/*crucial; don't merge the 2 divs above*/}
                {chatSnap.messages.filter(msg => msg.status !== 'deleted')
                    .map((msg, index) =>
                        <div className="flex flex-col gap-1 mr-2" key={msg.id}>
                            <Row chatId={chatSnap.id}
                                 messageSnap={msg}
                                 shouldBeInHistory={shouldBeInHistory.has(index)}
                                 shouldLoadAudio={shouldLoadVoice.has(index)}
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
    messageSnap: Message
    shouldBeInHistory: boolean
    shouldLoadAudio: boolean
}

const Row: React.FC<Props> = ({
                                  chatId,
                                  messageSnap: messageSnap,
                                  shouldBeInHistory,
                                  shouldLoadAudio
                              }) => {

    const markAsDeleted = useCallback(() => {
        markMessageAsDeleted(chatId, messageSnap.id)
    }, [chatId, messageSnap.id])

    switch (messageSnap.status) {
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
    if (messageSnap.audio) {
        m = <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900 self-end">
            <Audio audioSnap={messageSnap.audio} self={messageSnap.role == "user"} loadAudio={shouldLoadAudio}/>
        </div>
    } else {
        m = <div className={shouldBeInHistory ? "border border-neutral-500 border-dashed" : ""}>
            <RichOpText deleteFunc={markAsDeleted} text={messageSnap.text}/>
        </div>
    }
    return <ErrorBoundary>
        {m}
    </ErrorBoundary>
}

