import {Message, OutAudio, outEventTypeAudio} from "../api/API.tsx";
import {v4 as uuidv4} from "uuid";
import {useConvStore} from "../state/ConversationStore.tsx";
import {useSettingStore} from "../state/Setting.tsx";
import {useSocketStore} from "../state/Socket.tsx";
import {newQueAns} from "../ds/Conversation.tsx";
import React, {useEffect} from "react";
import {useSendingAudioStore} from "../state/Input.tsx";
import {blobToBase64, historyMessages, sendMessage} from "../Util.tsx";
import {useRecorderStore} from "../state/Recording.tsx";
import {addBlob} from "../store/BlobDB.tsx";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscribeSendingAudio: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const maxHistoryMessage = useSettingStore((state) => state.maxHistoryMessage)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const socket = useSocketStore.getState().socket
    const sendingAudio = useSendingAudioStore((state) => state.sendingAudio)
    const recordDuration = useRecorderStore((state) => state.duration)
    const minSpeakTimeToSend = useSettingStore((state) => state.minSpeakTimeToSend)

    useEffect(() => {
        if (sendingAudio.length === 0) {
            console.warn("audio blob is empty")
            return
        }

        if (recordDuration < minSpeakTimeToSend) {
            console.info("audio is less than ms", minSpeakTimeToSend)
            return
        }

        const id = uuidv4()
        let messages = historyMessages(qaSlice, maxHistoryMessage)
        messages = [systemMessage, ...messages]

        blobToBase64(sendingAudio).then((r) => {
            const event: OutAudio = {
                id: id,
                type: outEventTypeAudio,
                audio: r,
                fileName: "audio.wav",
                conversation: messages
            }
            sendMessage(socket, event)
        })

        addBlob({id: id, blob: sendingAudio}).then(() => {
            console.debug("saved audio blob", id)
            const qa = newQueAns(id, true)
            qa.que.audio!.audioBlobKey = id
            qa.que.audio!.status = 'done'
            qa.que.text.status = 'pending'
            pushQueAns(qa)
        }).catch((e) => {
            console.error("failed to save audio blob", id, e)
        })

    }, [sendingAudio]);
    return null
}
