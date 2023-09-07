import {useEffect} from 'react';
import * as event from "../../api/sse/event.ts";
import {base64ToBlob, formatNow, randomHash} from "../../util/util.tsx";
import {audioPlayerMimeType, SSEEndpoint} from '../../config.ts';
import {useAuthStore} from "../../state/auth.tsx";
import {fetchEventSource} from '@microsoft/fetch-event-source';
import {useSSEStore} from "../../state/sse.tsx";
import {addBlob} from "../../persist/blob-db.tsx";
import {mergeAbility} from "../../data-structure/ability/client-ability.tsx";
import {
    EventMessageAudio,
    EventMessageError,
    EventMessageTextEOF,
    EventMessageTextTyping, EventSystemAbility,
    MessageMeta
} from "../../api/sse/event.ts";
import {newThinking, onAudio, onEOF, onError, onTyping} from "../../data-structure/message.tsx";
import {ServerAbility} from "../../api/sse/server-ability.ts";
import {useSettingStore} from "../../state/setting.ts";
import {useChatStore} from "../../state/convs.tsx";

export const SSE = () => {
    const passwordHash = useAuthStore((state) => state.passwordHash)
    const streamId = useSSEStore((state) => state.streamId)
    const getMessage = useChatStore(state => state.getMessage)
    const pushMessage = useChatStore(state => state.pushMessage)
    const updateMessage = useChatStore(state => state.updateMessage)
    const setAbility = useSettingStore(state => state.setAbility)
    const getAbility = useSettingStore(state => state.getAbility)
    useEffect(() => {
        const ep = SSEEndpoint()
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
                console.info("EventSource connected to server, response: ", response);
            },
            onmessage: (msg) => {
                console.debug("received an msg from SSE server", msg.event, msg.data.slice(0, 100))
                if (msg.event === event.EventMessageThinking) {
                    const meta: MessageMeta = JSON.parse(msg.data)
                    const message = newThinking(meta.messageID)
                    pushMessage(meta.chatId, message)
                } else if (msg.event == EventMessageTextTyping) {
                    const eventText: event.Text = JSON.parse(msg.data)
                    const prev = getMessage(eventText.chatId, eventText.messageID)
                    if (prev === undefined) {
                        console.debug("message not found:", eventText.chatId, eventText.messageID)
                        return
                    }
                    const now = onTyping(prev, eventText.text)
                    updateMessage(eventText.chatId, now)
                } else if (msg.event == EventMessageTextEOF) {
                    const meta: MessageMeta = JSON.parse(msg.data)
                    const prev = getMessage(meta.chatId, meta.messageID)
                    if (prev === undefined) {
                        console.debug("message not found:", meta.chatId, meta.messageID)
                        return
                    }
                    const now = onEOF(prev)
                    updateMessage(meta.chatId, now)
                } else if (msg.event == EventMessageAudio) {
                    const eventAudio: event.Audio = JSON.parse(msg.data)
                    const blob = base64ToBlob(eventAudio.audio, audioPlayerMimeType);
                    const blobId = formatNow() + "-" + randomHash().slice(0, 10)
                    addBlob({id: blobId, blob: blob}).then(() => {
                        console.debug("saved audio, blobId:", blobId)
                        const prev = getMessage(eventAudio.chatId, eventAudio.messageID)
                        if (prev === undefined) {
                            console.debug("message not found:", eventAudio.chatId, eventAudio.messageID)
                            return
                        }
                        const now = onAudio(prev, {id: blobId, durationMs: eventAudio.durationMs})
                        updateMessage(eventAudio.chatId, now)
                    }).catch((e) => {
                        console.error("failed to save audio, blobId,chatId,messageID:", blobId, eventAudio.chatId, eventAudio.messageID, e)
                    })
                } else if (msg.event === EventMessageError) {
                    const eventError: event.Error = JSON.parse(msg.data)
                    const prev = getMessage(eventError.chatId, eventError.messageID)
                    if (prev === undefined) {
                        console.debug("message not found:", eventError.chatId, eventError.messageID)
                        return
                    }
                    const now = onError(prev, eventError.eMessage)
                    updateMessage(eventError.chatId, now)
                } else if (msg.event === EventSystemAbility) {
                    const sa: ServerAbility = JSON.parse(msg.data)
                    const newAbility = mergeAbility(getAbility(), sa)
                    setAbility(newAbility)
                } else {
                    console.warn("unknown event type:", msg.event)
                }
            },
            onerror: (err) => {
                console.error("SSE error", err)
            }
        })
        return () => {
            ctrl.abort("reconnecting")
        }
    }, [streamId, passwordHash])
    return null
}

