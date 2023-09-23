import {useEffect} from 'react';
import {fetchEventSource} from '@microsoft/fetch-event-source';
import {useSnapshot} from "valtio/react";
import {networkState} from "../../state/network-state.ts";
import {appState, findChatProxy, findMessage} from "../../state/app-state.ts";
import {ServerAbility} from "./server-ability.ts";
import {newError, newThinking, onAudio, onEOF, onError, onTyping} from "../../data-structure/message.tsx";
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
} from "./event.ts";
import {base64ToBlob, generateUudioId, randomHash32Char} from "../../util/util.tsx";
import {audioDb} from "../../state/db.ts";
import {audioPlayerMimeType, SSEEndpoint} from "../../config.ts";
import {adjustOption} from "../../data-structure/client-option.tsx";

export const SSE = () => {
    const {passwordHash} = useSnapshot(appState.auth)

    useEffect(() => {
        const ep = SSEEndpoint()
        const streamId = randomHash32Char()
        networkState.streamId = streamId
        const url = ep + "?stream=" + streamId

        console.info("connecting to SSE: ", url);
        const ctrl = new AbortController();
        fetchEventSource(url, {
            signal: ctrl.signal,
            headers: {
                'Authorization': 'Bearer ' + passwordHash,
            },
            keepalive: true,
            onopen: async (response: Response) => {
                console.info("[SSE] connected to server, response: ", response);
            },
            onmessage: (msg) => {
                // console.debug("received a msg from SSE server", msg.event, msg.data.slice(0, 500))
                const data = JSON.parse(msg.data)
                if (msg.event === EventSystemAbility) {
                    console.debug("received a msg of ability from SSE server", msg.event, msg.data.slice(0, 500))
                    const sa = data as ServerAbility
                    adjustOption(appState.option, sa)
                    for (const chat of appState.chats) {
                        adjustOption(chat.option, sa)
                    }
                    // eslint-disable-next-line valtio/state-snapshot-rule
                    appState.ability = sa
                    return;
                }

                // the following event are all related to chat
                const chatId = (data as SSEMsgMeta).chatId!
                const chatProxy = findChatProxy(chatId)?.[0]
                if (!chatProxy) {
                    console.warn("received an event from server, but can't find a chat to deal with, " +
                        "this usually happens when a chat has been deleted, or this would be fatal err that requires " +
                        "our developers to re-check the code. chatId:", chatId)
                    return
                }
                const meta: SSEMsgMeta = data
                if (msg.event === EventMessageThinking) {
                    const found = findMessage(chatProxy, meta.messageID);
                    if (found) {
                        console.info("duplicated thinking: ", chatId, meta.messageID)
                        return
                    }
                    const message = newThinking(meta.messageID, meta.ticketId, meta.role)
                    chatProxy.messages.push(message)
                } else if (msg.event == EventMessageTextTyping) {
                    const found = findMessage(chatProxy, meta.messageID);
                    if (!found) {
                        console.info("can't find a message to deal with, skipping... chatId,messageId: ", chatId, meta.messageID)
                        return
                    }
                    const text: SSEMsgText = data
                    onTyping(found, text.text)
                } else if (msg.event == EventMessageTextEOF) {
                    const found = findMessage(chatProxy, meta.messageID);
                    if (!found) {
                        console.info("can't find a message to deal with, skipping... chatId,messageId: ", chatId, meta.messageID)
                        return
                    }
                    const text: SSEMsgText = data
                    onEOF(found, text.text ?? "")
                } else if (msg.event == EventMessageAudio) {
                    const found = findMessage(chatProxy, meta.messageID);
                    if (!found) {
                        console.info("can't find a message to deal with, skipping... chatId,messageId: ", chatId, meta.messageID)
                        return
                    }
                    const audio: SSEMsgAudio = data
                    const blob = base64ToBlob(audio.audio, audioPlayerMimeType);
                    const audioId = generateUudioId("synthesis")
                    audioDb.setItem(audioId, blob, () => {
                        onAudio(found!, {id: audioId, durationMs: audio.durationMs})
                    })
                } else if (msg.event === EventMessageError) {
                    const error = data as SSEMsgError
                    let msg = findMessage(chatProxy, meta.messageID);
                    if (msg) {
                        onError(msg, error.errMsg)
                    } else {
                        msg = newError(error.messageID, error.ticketId, error.role, error.errMsg)
                        chatProxy.messages.push(msg)
                    }
                } else {
                    console.warn("unknown event type:", msg.event)
                }
            },
            onerror: (err) => {
                console.error("[SSE] error:", err)
            },
            onclose: () => {
                console.info("[SSE] closed")
            }
        })
        return () => {
            console.info("[SSE] trying to abort")
            ctrl.abort()
        }
    }, [passwordHash])
    return null
}

