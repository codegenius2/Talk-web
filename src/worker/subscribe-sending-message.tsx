import React, {useEffect} from "react";
import {useSendingMessageStore} from "../state/input.tsx";
import {useRecorderStore} from "../state/recording.tsx";
import {addBlob} from "../persist/blob-db.tsx";
import {Message} from "../api/restful.ts";
import {minSpeakTimeMillis, RecordingMimeType} from "../config.ts";
import {AxiosError} from "axios";
import {useRestfulAPIStore} from "../state/axios.tsx";
import {randomHash} from "../util/util.tsx";
import {maxHistory} from "../data-structure/ability/llm.ts";
import {toTalkOption} from "../data-structure/ability/client-ability.tsx";
import {newSending, onAudio, onError, onSent} from "../data-structure/message.tsx";
import {historyMessages, useChatStore} from "../state/chat.tsx";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscribeSendingMessage: React.FC = () => {

    const getChat = useChatStore((state) => state.getChat)
    const getMessage = useChatStore((state) => state.getMessage)
    const pushMessageOr = useChatStore((state) => state.pushMessageOr)
    const replaceMessageOr = useChatStore((state) => state.replaceMessageOr)
    const pop = useSendingMessageStore((state) => state.pop)
    const sendingMessages = useSendingMessageStore((state) => state.sendingMessages)
    const recordingMimeType: RecordingMimeType | undefined = useRecorderStore((state) => state.recordingMimeType)
    const restfulAPI = useRestfulAPIStore((state) => state.restfulAPI);

    useEffect(() => {
        if (sendingMessages.length === 0) {
            return;
        }
        const sm = pop();
        if (!sm) {
            return
        }
        if (sm.audioBlob) {
            if (sm.durationMs! < minSpeakTimeMillis) {
                console.info("audio is less than ms", minSpeakTimeMillis)
                return
            }
        }

        const chat = getChat(sm.chatId)
        if (!chat) {
            console.error("cannot get a chat from chats, chatId:")
            return
        }

        const ability = chat.ability

        let messages = historyMessages(chat, maxHistory(ability.llm))
        messages = [systemMessage, ...messages]

        const message = newSending()
        let promise
        if (sm.audioBlob) {
            console.debug("sending audio and chat: ", messages)
            message.audio = {id: ""}
            pushMessageOr(chat.id, message, "throw")
            promise = restfulAPI.postAudioChat(sm.audioBlob, recordingMimeType?.fileName ?? "audio.webm", {
                chatId: chat.id,
                ticketId: randomHash(),
                ms: messages,
                talkOption: toTalkOption(ability)
            });
        } else {
            messages.push({role: "user", content: sm.text})
            console.debug("sending chat: ", messages)
            pushMessageOr(chat.id, message, "throw")
            promise = restfulAPI.postChat({
                chatId: chat.id,
                ticketId: randomHash(),
                ms: messages,
                talkOption: toTalkOption(ability)
            });
        }

        promise.then((r) => {
                const prev = getMessage(chat.id, message.id)
                if (!prev) {
                    console.error("cannot get a message from chat, chatId,messageId:", chat.id, message.id)
                    return
                }
                if (r.status >= 200 && r.status < 300) {
                    const now = onSent(prev)
                    replaceMessageOr(chat.id, now, "ignore")
                } else {
                    const now = onError(prev, "Failed to send, reason:" + r.statusText)
                    replaceMessageOr(chat.id, now, "ignore")
                }
            }
        ).catch((e: AxiosError) => {
            const prev = getMessage(chat.id, message.id)
            if (!prev) {
                console.error("cannot get a message from chat, chatId,messageId:", chat.id, message.id)
                return
            }
            const now = onError(prev, "Failed to send, reason:" + e.message)
            replaceMessageOr(chat.id, now, "ignore")
        })

        if (sm.audioBlob) {
            const audioId = randomHash()
            addBlob({id: audioId, blob: sm.audioBlob}).then(() => {
                const prev = getMessage(chat.id, message.id)
                if (!prev) {
                    console.error("cannot get a message from chat, chatId,messageId:", chat.id, message.id)
                    return
                }
                const now = onAudio(prev, {id: audioId})
                replaceMessageOr(chat.id, now, "ignore")
            }).catch((e) => {
                console.error("failed to save audio blob, audioId:", message.id, e.message)
            })
        }
    }, [sendingMessages]);
    return null
}
