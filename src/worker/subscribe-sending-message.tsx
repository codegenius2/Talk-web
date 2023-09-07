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
import {historyMessages, useChatStore} from "../state/convs.tsx";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscribeSendingMessage: React.FC = () => {

    const getChat = useChatStore((state) => state.getChat)
    const getMessage = useChatStore((state) => state.getMessage)
    const pushMessage = useChatStore((state) => state.pushMessage)
    const updateMessage = useChatStore((state) => state.updateMessage)
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

        const id = randomHash()
        const message = newSending(id)
        let promise
        if (sm.audioBlob) {
            console.debug("sending audio and chat: ", messages)
            message.audio = {id: ""}
            pushMessage(chat.id, message)
            promise = restfulAPI.postAudioChat(sm.audioBlob, recordingMimeType?.fileName ?? "audio.webm", {
                id: id,
                ms: messages,
                talkOption: toTalkOption(ability)
            });
        } else {
            messages.push({role: "user", content: sm.text})
            console.debug("sending chat: ", messages)
            promise = restfulAPI.postChat({
                id: id,
                ms: messages,
                talkOption: toTalkOption(ability)
            });
        }

        promise.then((r) => {
                const prev = getMessage(chat.id, id)
                if (!prev) {
                    console.error("cannot get a message from chat, chatId,messageId:", chat.id, id)
                    return
                }
                if (r.status >= 200 && r.status < 300) {
                    const now = onSent(prev)
                    updateMessage(chat.id, now)
                } else {
                    const now = onError(prev, "Failed to send, reason:" + r.statusText)
                    updateMessage(chat.id, now)
                }
            }
        ).catch((e: AxiosError) => {
            const prev = getMessage(chat.id, id)
            if (!prev) {
                console.error("cannot get a message from chat, chatId,messageId:", chat.id, id)
                return
            }
            const now = onError(prev, "Failed to send, reason:" + e.message)
            updateMessage(chat.id, now)
        })

        if (sm.audioBlob) {
            const audioId = randomHash()
            addBlob({id: audioId, blob: sm.audioBlob}).then(() => {
                const prev = getMessage(chat.id, id)
                if (!prev) {
                    console.error("cannot get a message from chat, chatId,messageId:", chat.id, id)
                    return
                }
                const now = onAudio(prev, {id: audioId})
                updateMessage(chat.id, now)
            }).catch((e) => {
                console.error("failed to save audio blob, audioId:", id, e.message)
            })
        }
    }, [sendingMessages]);
    return null
}
