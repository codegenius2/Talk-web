import React, {useEffect} from "react"
import {useSnapshot} from "valtio/react"
import {snapshot} from "valtio"
import {AxiosError} from "axios"
import {controlState} from "../state/control-state.ts"
import {findChatProxy, findMessage} from "../state/app-state.ts"
import {attachedMessages} from "../api/restful/util.ts"
import {newSending, onAudio, onError, onSent} from "../data-structure/message.tsx"
import {postAudioChat, postChat} from "../api/restful/api.ts"
import {generateAudioId} from "../util/util.tsx"
import {audioDb} from "../state/db.ts"
import {minSpeakTimeMillis} from "../config.ts"
import {toRestfulAPIOption} from "../data-structure/client-option.tsx"
import {findPrompt} from "../state/promt-state.ts";

export const SubscribeSendingMessage: React.FC = () => {

    const {sendingMessageSignal} = useSnapshot(controlState)
    useEffect(() => {
        if (controlState.sendingMessages.length === 0) {
            return
        }
        const [sm] = controlState.sendingMessages.splice(0, 1)
        if (!sm) {
            return
        }
        // in case there are more messages in the queue
        controlState.sendingMessageSignal++

        if (sm.audioBlob) {
            if (sm.durationMs! < minSpeakTimeMillis) {
                console.info("audio is less than ms", minSpeakTimeMillis)
                return
            }
        }

        const chatProxy = findChatProxy(sm.chatId)?.[0]
        if (!chatProxy) {
            console.warn("chat does exist any more, chatId:", sm.chatId)
            return
        }

        const option = snapshot(chatProxy.option)

        let messages = attachedMessages(chatProxy.messages, option.llm.maxAttached)
        const prompt = findPrompt(chatProxy.promptId);
        if (prompt) {
            const pms = prompt.messages.filter(it => it.content.trim() !== "")
            messages = [...pms, ...messages]
        }

        const nonProxyMessage = newSending()
        const talkOption = toRestfulAPIOption(option)
        let postPromise
        if (sm.audioBlob) {
            nonProxyMessage.audio = {id: ""}
            chatProxy.messages.push(nonProxyMessage)

            console.debug("sending audio and chat, chatId,messages: ", chatProxy.id, messages)
            postPromise = postAudioChat(sm.audioBlob as Blob, controlState.recordingMimeType?.fileName ?? "audio.webm", {
                chatId: chatProxy.id,
                ticketId: nonProxyMessage.ticketId,
                ms: messages,
                talkOption: talkOption
            })
        } else {
            messages.push({role: "user", content: sm.text})
            nonProxyMessage.text = sm.text
            chatProxy.messages.push(nonProxyMessage)
            postPromise = postChat({
                chatId: chatProxy.id,
                ticketId: nonProxyMessage.ticketId,
                ms: messages,
                talkOption: talkOption
            })
        }

        postPromise.then((r) => {
                const msg = findMessage(chatProxy, nonProxyMessage.id)
                if (!msg) {
                    console.error("message not found after pushing, chatId,messageId:", chatProxy.id, nonProxyMessage.id)
                    return
                }
                if (r.status >= 200 && r.status < 300) {
                    onSent(msg)
                } else {
                    const data = typeof r.data === "string" ? r.data : ""
                    onError(msg, "Failed to send, reason: " + r.statusText + "," + data)
                }
            }
        ).catch((e: AxiosError) => {
            const msg = findMessage(chatProxy, nonProxyMessage.id)
            if (!msg) {
                console.error("message not found after pushing, chatId,messageId:", chatProxy.id, nonProxyMessage.id)
                return
            }
            onError(msg, "Failed to send, reason:" + e.message)
        })

        if (sm.audioBlob) {
            const audioId = generateAudioId("recording")
            audioDb.setItem<Blob>(audioId, sm.audioBlob as Blob, (err, value) => {
                    if (err || !value) {
                        console.debug("failed to save audio blob, audioId:", audioId, err)
                    } else {
                        const msg = findMessage(chatProxy, nonProxyMessage.id)
                        if (!msg) {
                            console.error("message not found after pushing, chatId,messageId:", chatProxy.id, nonProxyMessage.id)
                            return
                        }
                        onAudio(msg, {id: audioId, durationMs: sm.durationMs})
                        console.debug("saved audio blob, audioId:", audioId)
                    }
                }
            )
        }
    }, [sendingMessageSignal])
    return null
}
