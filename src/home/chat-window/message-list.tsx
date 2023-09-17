/* eslint-disable valtio/state-snapshot-rule */
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
import {DropDownMenu} from "./compnent/drop-down-menu.tsx";
import {PiDownloadSimpleLight} from "react-icons/pi";
import {audioDb} from "../../state/db.ts";

type MLProps = {
    chatProxy: Chat
}

export const MessageList: React.FC<MLProps> = ({chatProxy}) => {
    const {id, messages, option} = useSnapshot(chatProxy)
    const scrollEndRef = useRef<HTMLDivElement>(null);

    const [shouldBeInHistory, setShouldBeInHistory] = useState<Set<number>>(new Set())
    const [shouldLoadVoice, setShouldLoadVoice] = useState<Set<number>>(new Set())

    const [messageCount, setMessageCount] = useState(0)
    const [lastState, setLastState] =
        useState<{ id: string, updatedAt: number }>({id: "", updatedAt: 0})

    const [isAtBottom, setIsAtBottom] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollEndRef.current) {
            scrollEndRef.current.scrollIntoView({behavior: "instant"})
        }
    }, [id]);

    useEffect(() => {
        const container = containerRef.current;

        const handleScroll = () => {
            if (container) {
                const {scrollTop, scrollHeight, clientHeight} = container;
                const isBottom = scrollTop + clientHeight >= scrollHeight;
                console.debug("isBottom", isBottom)
                setIsAtBottom(isBottom);
            }
        };

        container?.addEventListener('scroll', handleScroll);

        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!scrollEndRef.current) {
            return
        }

        if (messageCount > 0 && !isAtBottom) {
            return
        }
        const len = messages.length
        const behavior = messageCount === 0 ? 'smooth' : 'instant'
        if (len > messageCount) {
            // scroll to bottom if new messages arrive
            scrollEndRef.current.scrollIntoView({behavior: behavior})
        } else {
            if (len > 0) {
                // scroll to bottom if last message was updated
                const lastMsg = messages[len - 1]
                if (lastMsg.lastUpdatedAt > lastState.updatedAt) {
                    scrollEndRef.current.scrollIntoView({behavior: behavior})
                }
                setLastState({id: lastMsg.id, updatedAt: lastMsg.lastUpdatedAt})
            }
        }
        setMessageCount(len)
    }, [messages]);

    useEffect(() => {
        // eslint-disable-next-line valtio/state-snapshot-rule
        const mh = option.llm.maxHistory
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
    }, [messages, option.llm.maxHistory])

    return (
        <div ref={containerRef}
             className="w-full overflow-y-auto pr-1 scrollbar-hidden hover:scrollbar-visible">
            <div className="flex w-full select-text flex-col justify-end gap-5 rounded-2xl">
                {/*crucial; don't merge the 2 divs above*/}
                {messages.map((msg, index) =>
                    msg.status !== 'deleted' &&
                    <ErrorBoundary key={msg.id}>
                        <Row chatId={id}
                             messageSnap={msg}
                             shouldBeInHistory={shouldBeInHistory.has(index)}
                             shouldLoadAudio={shouldLoadVoice.has(index)}
                        />
                    </ErrorBoundary>
                )}
            </div>
            <div ref={scrollEndRef}/>
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

    const {showBorderAroundHistoryMessage} = useSnapshot(appState.pref)

    const [theme, setTheme] = useState(neutralColor)
    const [hoveringOnRow, setHoveringOnRow] = useState(false)

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


    return (
        <div className={cx("flex items-center gap-1 w-full",
            messageSnap.role === "user" && "justify-end")}
             onMouseOver={() => setHoveringOnRow(true)}
             onMouseLeave={() => setHoveringOnRow(false)}
        >
            {messageSnap.role === "user" && messageSnap.status !== 'thinking' && hoveringOnRow &&
                <div className="px-2 select-none flex gap-1 items-center text-neutral-200 rounded cursor-pointer">
                    {
                        messageSnap.audio &&
                        <AudioMenu deleteAction={markAsDeleted} audioId={messageSnap.audio.id}/>
                    }
                    {
                        messageSnap.text &&
                        <TextMenu deleteAction={markAsDeleted}/>
                    }
                    {messageSnap.text && <MyCopy text={messageSnap.text}></MyCopy>}
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
                    showBorderAroundHistoryMessage && "p-1 border-2 border-dashed",
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
                <div className="px-2 select-none flex gap-1 items-center text-neutral-200 rounded cursor-pointer ">
                    {messageSnap.text && <MyCopy text={messageSnap.text}></MyCopy>}
                    {
                        messageSnap.audio &&
                        <AudioMenu deleteAction={markAsDeleted} audioId={messageSnap.audio.id}/>
                    }
                    {
                        messageSnap.text &&
                        <TextMenu deleteAction={markAsDeleted}/>
                    }
                </div>
            }
        </div>
    )
}

type CopyProps = {
    text: string
}

export const MyCopy: React.FC<CopyProps> = ({text}) => {
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setCopied(false)
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    }, [copied]);
    return <CopyToClipboard text={text}
                            onCopy={() => setCopied(true)}>
        <MdOutlineContentCopy className={cx("p-1 rounded transition-all duration-100 h-8 w-8",
            copied ? "scale-125" :
                "h-7 w-7 text-violet-50 hover:text-neutral-500 hover:bg-white/[0.8]"
        )}/>
    </CopyToClipboard>
}

type TextMenuProps = {
    deleteAction: () => void
}

export const TextMenu: React.FC<TextMenuProps> = ({deleteAction}) => {
    return <DropDownMenu list={[
        {
            name: "Delete",
            action: deleteAction,
            icon: <BsTrash3 className="text-red-600"/>
        }
    ]}/>
}

type AudioMenuProps = {
    deleteAction: () => void
    audioId: string
}

export const AudioMenu: React.FC<AudioMenuProps> = ({deleteAction, audioId}) => {
    const [url, setUrl] = useState("")

    useEffect(() => {
            if (audioId) {
                audioDb.getItem<Blob>(audioId, (err, blob) => {
                        if (err) {
                            console.warn("failed to loaded audio blob, audioId:", audioId, err)
                            return
                        }
                        if (blob) {
                            const url = URL.createObjectURL(blob)
                            setUrl(url)
                        } else {
                            console.error("audio blob is empty, audioId:", audioId)
                        }
                    }
                ).then(() => true)
            }
        }, [audioId]
    );

    return <DropDownMenu list={[
        {
            name: "Download",
            download: {
                url: url,
                fileName: audioId
            },
            icon: <PiDownloadSimpleLight className="w-5 h-5"/>
        }, {
            name: "Delete",
            action: deleteAction,
            icon: <BsTrash3 className="text-red-600"/>
        }
    ]}/>
}