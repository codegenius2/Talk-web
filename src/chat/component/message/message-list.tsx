import React, {useCallback, useEffect, useRef, useState} from "react";
import {useSnapshot} from "valtio/react";
import {Chat, deleteMessage} from "../../../state/app-state.ts";
import {ClientLLM, maxHistory} from "../../../state/data-structure/client-ability/llm.ts";
import {isInHistory, Message} from "../../../state/data-structure/message.tsx";
import {Audio} from "./audio.tsx";
import {RichOpText} from "./rich-op-text.tsx";
import ErrorBoundary from "./error-boundary.tsx";
import {maxLoadedVoice} from "../../../config.ts";

type MLProps = {
    chatProxy: Chat
}

export const MessageList: React.FC<MLProps> = ({chatProxy}) => {
    const chatSnp = useSnapshot(chatProxy)
    const scrollRef = useRef<HTMLDivElement>(null);

    const [shouldBeInHistory, setShouldBeInHistory] = useState<Set<number>>(new Set())
    const [shouldLoadVoice, setShouldLoadVoice] = useState<Set<number>>(new Set())

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current!.scrollIntoView({behavior: 'instant'})
        }
    }); // run once on mount

    useEffect(() => {
        const messages = chatSnp.messages
        const mh = maxHistory(chatSnp.ability.llm as ClientLLM)
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
    }, [chatSnp, shouldBeInHistory, shouldLoadVoice])

    return (
        <div className="overflow-y-auto overflow-x-hidden w-full scrollbar-hide hover:scrollbar-show">
            <div className="flex flex-col gap-5 rounded-lg w-full justify-end">
                {/*crucial; don't merge the 2 divs above*/}
                {chatSnp.messages.filter(msg => msg.status !== 'deleted')
                    .map((msg, index) =>
                        <div className="flex flex-col gap-1 mr-2" key={msg.id}>
                            <Row chatId={chatSnp.id}
                                 messageSnp={msg}
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
    messageSnp: Message
    shouldBeInHistory: boolean
    shouldLoadAudio: boolean
}

const Row: React.FC<Props> = ({
                                  chatId,
                                  messageSnp: messageSnp,
                                  shouldBeInHistory,
                                  shouldLoadAudio
                              }) => {

    const handleDelete = useCallback(() => {
        deleteMessage(chatId, messageSnp.id)
    }, [chatId, messageSnp.id])

    switch (messageSnp.status) {
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
    if (messageSnp.audio) {
        m = <div className="rounded-lg max-w-1/2 md:max-w-2/5 w-full text-neutral-900 self-end">
            <Audio audioSnp={messageSnp.audio} self={messageSnp.role == "user"} loadAudio={shouldLoadAudio}/>
        </div>
    } else {
        m = <div className={shouldBeInHistory ? "border border-neutral-500 border-dashed" : ""}>
            <RichOpText deleteFunc={handleDelete} text={messageSnp.text}/>
        </div>
    }
    return <ErrorBoundary>
        {m}
    </ErrorBoundary>
}

