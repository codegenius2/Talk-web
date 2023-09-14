import React, {useEffect} from "react";
import {useSnapshot} from "valtio/react";
import {snapshot} from "valtio";
import {AxiosError} from "axios";
import {controlState} from "../state/control-state.ts";
import {findChatProxy} from "../state/app-state.ts";
import {historyMessages} from "../api/restful/util.ts";
import {newSending, onError, onSent} from "../data-structure/message.tsx";
import {postAudioChat, postChat} from "../api/restful/api.ts";
import {randomHash16Char} from "../util/util.tsx";
import {audioDb} from "../state/db.ts";
import {LLMMessage} from "../shared-types.ts";
import {minSpeakTimeMillis} from "../config.ts";
import {toRestfulAPIOption} from "../data-structure/client-option.tsx";

const systemMessage: LLMMessage = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscribeSendingMessage: React.FC = () => {

    const controlSnp = useSnapshot(controlState)
    useEffect(() => {
        if (controlState.sendingMessages.length === 0) {
            return;
        }
        const [sm] = controlState.sendingMessages.splice(0, 1)
        if (!sm) {
            return
        }
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

        let messages = historyMessages(chatProxy, option.llm.maxHistory)
        messages = [systemMessage, ...messages]

        const message = newSending()
        const talkOption = toRestfulAPIOption(option)
        let postPromise
        if (sm.audioBlob) {
            console.debug("sending audio and chat: ", message)
            message.audio = {id: ""}
            chatProxy.messages.push(message)

            postPromise = postAudioChat(sm.audioBlob as Blob, controlSnp.recordingMimeType?.fileName ?? "audio.webm", {
                chatId: chatProxy.id,
                ticketId: randomHash16Char(),
                ms: messages,
                talkOption: talkOption
            });
        } else {
            messages.push({role: "user", content: sm.text})
            console.debug("sending chat: ", messages)
            chatProxy.messages.push(message)
            postPromise = postChat({
                chatId: chatProxy.id,
                ticketId: randomHash16Char(),
                ms: messages,
                talkOption: talkOption
            });
        }

        postPromise.then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    onSent(message)
                } else {
                    onError(message, "Failed to send, reason:" + r.statusText)
                }
            }
        ).catch((e: AxiosError) => {
            onError(message, "Failed to send, reason:" + e.message)
        })

        if (sm.audioBlob) {
            const audioId = randomHash16Char()
            audioDb.setItem<Blob>(audioId, sm.audioBlob as Blob, () => console.debug("saved audio blob, audioId:", audioId))
        }
    }, [controlSnp.recordingMimeType?.fileName, controlSnp.sendingMessageSignal]);
    return null
}
