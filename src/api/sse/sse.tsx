import {useEffect} from 'react'
import {useSnapshot} from "valtio/react"
import {networkState} from "../../state/network-state.ts"
import {appState, findChatProxy, findMessage, findMessage2} from "../../state/app-state.ts"
import {ServerAbility} from "./server-ability.ts"
import {newError, newThinking, onAudio, onEOF, onError, onThinking, onTyping} from "../../data-structure/message.tsx"
import {
    EventMessageAudio,
    EventMessageError,
    EventMessageTextEOF,
    EventMessageTextTyping,
    EventMessageThinking,
    EventSystemAbility,
    SSEMsgAudio,
    SSEMsgError,
    SSEMsgMeta,
    SSEMsgText
} from "./event.ts"
import {base64ToBlob, generateUudioId, randomHash32Char} from "../../util/util.tsx"
import {audioDb} from "../../state/db.ts"
import {audioPlayerMimeType, SSEEndpoint} from "../../config.ts"
import {adjustOption} from "../../data-structure/client-option.tsx"


export const SSE = () => {
    const {passwordHash} = useSnapshot(appState.auth)
    // console.info("SSE rendered", new Date().toLocaleString())


    useEffect(() => {
            const ep = SSEEndpoint()
            const streamId = randomHash32Char()
            networkState.streamId = streamId
            const url = `${ep}?stream=${streamId}&passwordHash=${passwordHash}`
            const eventSource = new EventSource(url);
            console.info("connecting to [SSE]: ", url)

            eventSource.onopen = (event) => {
                console.info("[SSE] connected to server, response: ", event)
                eventSource.withCredentials
            }

            eventSource.onerror = (event) => {
                console.error("[SSE] error: ", event);
            }

            eventSource.addEventListener(EventSystemAbility, (event: MessageEvent<string>) => {
                console.debug("received ability from SSE server", event.type, event.data)
                const sa: ServerAbility = JSON.parse(event.data)
                adjustOption(appState.option, sa)
                for (const chat of appState.chats) {
                    adjustOption(chat.option, sa)
                }
                // eslint-disable-next-line valtio/state-snapshot-rule
                appState.ability = sa
            })

            eventSource.addEventListener(EventMessageThinking, (event: MessageEvent<string>) => {
                console.debug("received EventMessageThinking")
                const meta: SSEMsgMeta = JSON.parse(event.data)
                const found = findChatProxy(meta.chatId, true)
                if (!found) {
                    return
                }
                const chat = found[0]
                const msg = findMessage(chat, meta.messageID)
                if (msg) {
                    onThinking(msg)
                } else {
                    const message = newThinking(meta.messageID, meta.ticketId, meta.role)
                    chat.messages.push(message)
                }
            })

            eventSource.addEventListener(EventMessageTextTyping, (event: MessageEvent<string>) => {
                const text: SSEMsgText = JSON.parse(event.data)
                const msg = findMessage2(text.chatId, text.messageID, true)
                if (msg) {
                    onTyping(msg, text.text)
                }
            })

            eventSource.addEventListener(EventMessageTextEOF, (event: MessageEvent<string>) => {
                const text: SSEMsgText = JSON.parse(event.data)
                const msg = findMessage2(text.chatId, text.messageID, true)
                if (msg) {
                    onEOF(msg, text.text ?? "")
                }
            })

            eventSource.addEventListener(EventMessageAudio, (event: MessageEvent<string>) => {
                const audio: SSEMsgAudio = JSON.parse(event.data)
                const msg = findMessage2(audio.chatId, audio.messageID, true)
                if (msg) {
                    const blob = base64ToBlob(audio.audio, audioPlayerMimeType)
                    const audioId = generateUudioId("synthesis")
                    audioDb.setItem(audioId, blob, () => {
                        onAudio(msg, {id: audioId, durationMs: audio.durationMs})
                    }).then(() => true)
                }
            })

            eventSource.addEventListener(EventMessageError, (event: MessageEvent<string>) => {
                const error: SSEMsgError = JSON.parse(event.data)
                const found = findChatProxy(error.chatId, true)
                if (!found) {
                    return
                }
                const chat = found[0]
                const msg = findMessage(chat, error.messageID)
                if (msg) {
                    onError(msg, error.errMsg)
                } else {
                    const m = newError(error.messageID, error.ticketId, error.role, error.errMsg)
                    chat.messages.push(m)
                }
            })

            return () => {
                console.info("[SSE] trying to abort")
                eventSource.close()
            }
        },
        [passwordHash]
    )
    return null
}
