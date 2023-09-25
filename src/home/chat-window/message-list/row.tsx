import {Message} from "../../../data-structure/message.tsx"
import React, {useCallback, useEffect, useState} from "react"
import {markMessageAsDeleted} from "../../../state/app-state.ts"
import {blueColor, neutralColor} from "../compnent/theme.ts"
import {cx} from "../../../util/util.tsx"
import {MySpin} from "../compnent/widget/icon.tsx"
import {Audio} from "../compnent/audio.tsx"
import {MyText} from "../compnent/my-text.tsx"
import {PiButterflyThin} from "react-icons/pi"
import {MyError} from "../compnent/my-error.tsx"
import {AudioMenu, Copy, TextMenu} from "./menu.tsx"
import {useSnapshot} from "valtio/react";
import {subscribeKey} from "valtio/utils";
import {messageState} from "../../../state/message-state.ts";

type Props = {
    chatId: string
    messageProxy: Message
}

export const Row: React.FC<Props> = ({
                                         chatId,
                                         messageProxy: messageProxy,
                                     }) => {
    // console.info("Row rendered, messageId:", messageProxy.id, new Date().toLocaleString())
    const messageSnap = useSnapshot(messageProxy)
    const [theme, setTheme] = useState(neutralColor)
    const [hoveringOnRow, setHoveringOnRow] = useState(false)
    const [isAttached, setIsAttached] = useState(false)

    useEffect(() => {
        const callback = () =>{ setIsAttached(messageState.record[messageProxy.id]?.attached ?? false)}
        const un = subscribeKey(messageState.record, messageProxy.id, callback)
        callback()
        return un
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const markAsDeleted = useCallback(() => {
        markMessageAsDeleted(chatId, messageSnap.id)
    }, [chatId, messageSnap.id])

    useEffect(() => {
        setTheme(messageSnap.role === "user" ? blueColor : neutralColor)
    }, [messageSnap.role])

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
                    {messageSnap.text && <Copy text={messageSnap.text}/>}
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
                    />
                </div>
            }
            {messageSnap.text &&
                <div className="relative rounded-2xl transition-all duration-200 max-w-3/4">
                    <MyText messageSnap={messageSnap} theme={theme}/>
                    {isAttached &&
                        <PiButterflyThin className={cx("absolute w-6 h-6 select-none", theme.attachIcon)}/>
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
                    {messageSnap.text && <Copy text={messageSnap.text}/>}
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