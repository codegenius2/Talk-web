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
import {PiButterflyThin, PiDownloadSimpleLight} from "react-icons/pi";
import {audioDb} from "../../state/db.ts";
import {addToPlayList, clearPlayList} from "../../state/control-state.ts";
import {HiOutlineChevronDown} from "react-icons/hi2";

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
    const [hasUpdate, setHasUpdate] = useState(0)
    const [hasNewAudio, setHasNewAudio] = useState("")

    const [isOverflow, setIsOverflow] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback((behavior?: 'instant' | 'smooth') => {
        if (scrollEndRef.current) {
            scrollEndRef.current.scrollIntoView({behavior: behavior ?? "instant"})
        }
    }, []);

    useEffect(() => {
        scrollToBottom()
    }, [id, scrollToBottom]);

    const onScroll = useCallback(() => {
    }, []);


    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (containerRef.current) {
                // console.debug("containerRef.current.scrollHeight > containerRef.current.clientHeight",containerRef.current.scrollHeight > containerRef.current.clientHeight)
                setIsOverflow(containerRef.current.scrollHeight > containerRef.current.clientHeight);
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                attributeFilter: ['style', 'class'],
            });
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const container = containerRef.current;

        const handleScroll = () => {
            if (container) {
                const {scrollTop, scrollHeight, clientHeight} = container;
                const isBottom = scrollTop + clientHeight >= scrollHeight - 200;
                setIsAtBottom(isBottom);
            }
        };

        container?.addEventListener('scroll', handleScroll);

        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const len = messages.length
        if (len > 0) {
            const msg = messages[len - 1]
            if (msg.id !== lastState.id && len > messageCount && messageCount !== 0 ||
                msg.id === lastState.id && msg.lastUpdatedAt > lastState.updatedAt) {
                setHasUpdate(h => h + 1)
                if (msg.audio?.id && msg.status === "received") {
                    setHasNewAudio(msg.audio.id)
                }
            }
            setLastState({id: msg.id, updatedAt: msg.lastUpdatedAt})
        }
        setMessageCount(len)
        // should only run when messages change
        // eslint-disable-next-line
    }, [messages]);

    useEffect(() => {
        if (scrollEndRef.current && isAtBottom && hasUpdate > 0) {
            scrollEndRef.current.scrollIntoView({behavior: 'instant'})
        }
        // Modifications to isAtBottom should not trigger useEffect
        // eslint-disable-next-line
    }, [hasUpdate]);

    useEffect(() => {
        if (hasNewAudio) {
            addToPlayList(hasNewAudio)
        }
    }, [hasNewAudio]);

    useEffect(() => {
        return () => clearPlayList()
    }, []);

    useEffect(() => {
        const copyListener = (event: ClipboardEvent) => {
            const selection = document.getSelection();
            if (selection) {
                event.clipboardData?.setData('text/plain', selection.toString().trim());
            }
            event.preventDefault();
        };
        const current = containerRef.current
        if (current) {
            current.addEventListener('copy', copyListener);
        }

        return () => {
            if (current) {
                current.removeEventListener('copy', copyListener)
            }
        };
    }, []);


    useEffect(() => {
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
            <div className="flex w-full select-text flex-col justify-end gap-3 rounded-2xl"
                 onResize={onScroll}
            >
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
            <div
                ref={scrollEndRef}
                className="h-10 select-none bg-transparent text-transparent" data-pseudo-content="ninja"/>
            <div className="sticky bottom-1 flex justify-end pr-3 z-40">
                <HiOutlineChevronDown
                    className={cx("h-8 w-8 p-1.5 bg-neutral-100 rounded-full",
                        isOverflow && !isAtBottom ? "" : "hidden")}
                    onClick={() => scrollToBottom("smooth")}
                />
            </div>

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

    const {butterflyOnHistoryMessage} = useSnapshot(appState.pref)

    const [theme, setTheme] = useState(neutralColor)
    const [hoveringOnRow, setHoveringOnRow] = useState(false)

    const markAsDeleted = useCallback(() => {
        markMessageAsDeleted(chatId, messageSnap.id)
    }, [chatId, messageSnap.id])

    useEffect(() => {
        setTheme(messageSnap.role === "user" ? blueColor : neutralColor)
    }, [messageSnap.role]);

    return (
        <div className={cx("flex items-center w-full",
            messageSnap.role === "user" && "justify-end")}
             onMouseOver={() => setHoveringOnRow(true)}
             onMouseLeave={() => setHoveringOnRow(false)}
        >
            {messageSnap.role === "user" && messageSnap.status !== 'thinking' && hoveringOnRow &&
                <div className="flex cursor-pointer select-none items-center gap-1 rounded px-2 text-neutral-200">
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
                <MySpin className="ml-2 h-5 w-5 select-none fill-white text-white"/>
            }

            {messageSnap.audio &&
                <div className="w-2/5 self-end rounded-lg sm:w-1/2">
                    <Audio audioSnap={messageSnap.audio}
                           chatId={chatId}
                           messageSnap={messageSnap}
                           theme={theme}
                           loadAudio={shouldLoadAudio}
                    />
                </div>
            }
            {messageSnap.text &&
                <div className="relative rounded-2xl transition-all duration-200 max-w-3/4">
                    <MyText messageSnap={messageSnap} theme={theme}/>
                    {shouldBeInHistory && butterflyOnHistoryMessage &&
                        <PiButterflyThin className={cx("absolute w-6 h-6 select-none", theme.historyIcon)}/>
                    }
                </div>
            }
            {messageSnap.status === 'error' && !messageSnap.text && !messageSnap.audio &&
                <div className="rounded-2xl max-w-3/4">
                    <MyError messageSnap={messageSnap} theme={theme}/>
                </div>
            }

            {messageSnap.role === "assistant" && messageSnap.status !== 'thinking' && hoveringOnRow &&
                <div className="flex cursor-pointer select-none items-center gap-1 rounded px-2 text-neutral-200">
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
            icon: <PiDownloadSimpleLight className="h-5 w-5"/>
        }, {
            name: "Delete",
            action: deleteAction,
            icon: <BsTrash3 className="text-red-600"/>
        }
    ]}/>
}