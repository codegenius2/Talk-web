import React, {useCallback, useEffect, useRef, useState} from "react";
import {appState, Chat, markMessageAsDeleted} from "../../state/app-state.ts";
import {isInHistory, Message} from "../../data-structure/message.tsx";
import {Audio} from "./compnent/audio.tsx";
import ErrorBoundary from "./compnent/error-boundary.tsx";
import {maxLoadedVoice} from "../../config.ts";
import {cx} from "../../util/util.tsx";
import {MyText} from "./compnent/my-text.tsx";
import {useSnapshot} from "valtio/react";
import {blueColor, neutralColor} from "./compnent/theme.ts";
import {MyError} from "./compnent/my-error.tsx";
import {MySpin} from "./compnent/widget/icon.tsx";
import {MdOutlineContentCopy} from "react-icons/md";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {BsTrash3} from "react-icons/bs";

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
    }, []); // run once on mount

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
            <div className="flex w-full select-text flex-col justify-end gap-5 rounded-2xl">
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

    const [theme, setTheme] = useState(neutralColor)
    const [hoveringOnRow, setHoveringOnRow] = useState(false)
    const [copied, setCopied] = useState(false);

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

    useEffect(() => {
        setTheme(messageSnap.role === "user" ? blueColor : neutralColor)
    }, [messageSnap.role]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCopied(false)
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [copied]);

    return (
        <div className={cx("flex items-center gap-1 w-full",
            messageSnap.role === "user" && "justify-end")}
             onMouseOver={() => setHoveringOnRow(true)}
             onMouseLeave={() => setHoveringOnRow(false)}
        >
            {messageSnap.role === "user" && messageSnap.status !== 'thinking' && hoveringOnRow &&
                <div className="px-2 select-none flex gap-1 items-center text-neutral-200 rounded cursor-pointer">
                    <BsTrash3 className="p-1 rounded transition-all duration-100 h-8 w-8
                     text-red-600/[0.8] hover:text-red-600 hover:bg-neutral-100/[0.5]"
                              onClick={markAsDeleted}
                    />
                    {!messageSnap.audio && <CopyToClipboard text={messageSnap.text}
                                                            onCopy={() => setCopied(true)}>
                        <MdOutlineContentCopy className={cx(" p-1 rounded transition-all duration-100 h-8 w-8",
                            copied ? "scale-125 text-violet-100 bg-green-400/[0.5]" :
                                "h-7 w-7 text-green-400 bg-green-400/[0] hover:text-green-600 hover:bg-neutral-100/[0.5]"
                        )}/>
                    </CopyToClipboard>}
                </div>
            }

            {messageSnap.status === 'thinking' &&
                <MySpin className={"ml-2 h-5 w-5 text-white fill-white"}/>
            }

            {messageSnap.audio &&
                <div className="w-2/5 self-end rounded-lg sm:w-1/2">
                    <Audio audioSnap={messageSnap.audio}
                           messageSnap={messageSnap}
                           theme={theme}
                           loadAudio={shouldLoadAudio}
                    />
                </div>
            }
            {messageSnap.text &&
                <div className={cx("rounded-2xl max-w-3/4",
                    prefSnap.showBorderAroundHistoryMessage && "p-1 border-2 border-dashed",
                    shouldBeInHistory ? "border-white" : "border-transparent")
                }
                >
                    <MyText messageSnap={messageSnap} theme={theme}/>
                </div>
            }
            {messageSnap.status === 'error' && !messageSnap.text && !messageSnap.audio &&
                <div className="rounded-2xl max-w-3/4">
                    <MyError messageSnap={messageSnap} theme={theme}/>
                </div>
            }

            {messageSnap.role === "assistant" && messageSnap.status !== 'thinking' && hoveringOnRow &&
                <div className="px-2 select-none flex gap-1 items-center text-neutral-200 rounded cursor-pointer">
                    {!messageSnap.audio && <CopyToClipboard text={messageSnap.text}
                                                            onCopy={() => setCopied(true)}>
                        <MdOutlineContentCopy className={cx(" p-1 rounded transition-all duration-100 h-8 w-8",
                            copied ? "scale-125 text-violet-100 bg-green-400/[0.5]" :
                                "h-7 w-7 text-green-400 bg-green-400/[0] hover:text-green-600 hover:bg-neutral-100/[0.5]"
                        )}/>
                    </CopyToClipboard>}
                    <BsTrash3 className="p-1 rounded transition-all duration-100 h-8 w-8
                     text-red-600/[0.8] hover:text-red-600 hover:bg-neutral-100/[0.5]"
                              onClick={markAsDeleted}
                    />
                </div>
            }
        </div>
    )
}

