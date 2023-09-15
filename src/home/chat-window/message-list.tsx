import React, {useCallback, useEffect, useRef, useState} from "react";
import {appState, Chat, markMessageAsDeleted} from "../../state/app-state.ts";
import {isInHistory, Message} from "../../data-structure/message.tsx";
import {Audio} from "./compnent/audio.tsx";
import ErrorBoundary from "./compnent/error-boundary.tsx";
import {maxLoadedVoice} from "../../config.ts";
import {cx} from "../../util/util.tsx";
import {MyText} from "./compnent/my-text.tsx";
import {useSnapshot} from "valtio/react";

type MLProps = {
    chatProxy: Chat
}

export const MessageList: React.FC<MLProps> = ({chatProxy}) => {
    const chatSnap = useSnapshot(chatProxy)
    const scrollRef = useRef<HTMLDivElement>(null);

    const [shouldBeInHistory, setShouldBeInHistory] = useState<Set<number>>(new Set())
    const [shouldLoadVoice, setShouldLoadVoice] = useState<Set<number>>(new Set())

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current!.scrollIntoView({behavior: 'instant'})
        }
    }); // run once on mount

    useEffect(() => {
        // eslint-disable-next-line valtio/state-snapshot-rule
        const messages = chatSnap.messages
        // eslint-disable-next-line valtio/state-snapshot-rule
        const mh = chatSnap.option.llm.maxHistory
        const hist: Set<number> = new Set()
        const load: Set<number> = new Set()
        for (let i = messages.length - 1; i >= 0; i--) {
            if (hist.size >= mh && load.size >= maxLoadedVoice) {
                break
            }
            if (messages[i].status === 'deleted') {
                continue
            }
            if (hist.size < mh) {
                if (isInHistory(messages[i])) {
                    hist.add(i)
                }
            }
            if (load.size < maxLoadedVoice) {
                if (messages[i].audio) {
                    load.add(i)
                }
            }
        }
        setShouldBeInHistory(hist)
        setShouldLoadVoice(load)
    }, [chatSnap])

    return (
        <div className="w-full overflow-y-auto pr-1 scrollbar-hidden hover:scrollbar-visible">
            <div className="flex w-full flex-col justify-end gap-5 rounded-lg select-text">
                {/*crucial; don't merge the 2 divs above*/}
                {chatSnap.messages.map((msg, index) =>
                    msg.status !== 'deleted' &&
                    <ErrorBoundary key={msg.id}>
                        <Row chatId={chatSnap.id}
                             messageSnap={msg}
                             shouldBeInHistory={shouldBeInHistory.has(index)}
                             shouldLoadAudio={shouldLoadVoice.has(index)}
                        />
                    </ErrorBoundary>
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
    const prefSnap = useSnapshot(appState.pref)

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

    return (
        <div className={cx("flex items-center gap-1 w-full",
            messageSnap.role === "user" && "justify-end")}
        >
            {messageSnap.role === "user" && <div className="select-none"> ...Options</div>}

            {messageSnap.audio &&
                <div className="w-2/5 self-end rounded-lg sm:w-1/2">
                    <Audio audioSnap={messageSnap.audio}
                           theme={messageSnap.role === "user" ? "blue" : "neutral"}
                           loadAudio={shouldLoadAudio}/>
                </div>
            }
            {messageSnap.text &&
                <div className={cx("max-w-3/4 rounded-2xl",
                    prefSnap.showBorderAroundHistoryMessage && "p-1 border-2 border-dashed",
                    shouldBeInHistory ? "border-white" : "border-transparent")
                }
                >
                    <MyText text={messageSnap.text} theme={messageSnap.role === "user" ? "blue" : "neutral"}/>
                </div>
            }

            {messageSnap.role === "assistant" && <div className="select-none"> ...Options</div>}
        </div>
    )
}

