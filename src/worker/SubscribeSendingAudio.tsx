import {v4 as uuidv4} from "uuid";
import {useConvStore} from "../state/ConversationStore.tsx";
import {useSettingStore} from "../state/Setting.tsx";
import {newQueAns} from "../ds/Conversation.tsx";
import React, {useEffect} from "react";
import {useSendingAudioStore} from "../state/Input.tsx";
import {historyMessages, RecordingMimeType} from "../util/Util.tsx";
import {useRecorderStore} from "../state/Recording.tsx";
import {addBlob} from "../store/BlobDB.tsx";
import {newMyText} from "../ds/Text.tsx";
import {error, newAudio, newAudioId, sent} from "../ds/Audio.tsx";
import {Message} from "../api/restful.ts";
import {postAudioConv} from "../api/axios.ts";
import {minSpeakTimeMillis} from "../config.ts";
import {AxiosError} from "axios";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscribeSendingAudio: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const maxHistory = useSettingStore((state) => state.maxHistory)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const updateQueAudio = useConvStore((state) => (state.updateQueAudio))
    const getQueAudio = useConvStore((state) => (state.getQueAudio))
    const sendingAudio = useSendingAudioStore((state) => state.sendingAudio)
    const recordDuration = useRecorderStore((state) => state.duration)
    const recordingMimeType: RecordingMimeType | undefined = useRecorderStore((state) => state.recordingMimeType)
    useEffect(() => {
        if (sendingAudio.length === 0) {
            console.warn("audio blob is empty")
            return
        }

        if (recordDuration < minSpeakTimeMillis) {
            console.info("audio is less than ms", minSpeakTimeMillis)
            return
        }

        const id = uuidv4()
        let messages = historyMessages(qaSlice, maxHistory)
        messages = [systemMessage, ...messages]

        const qa = newQueAns(id, false, newMyText('receiving', ""), newAudio("sending"))
        pushQueAns(qa)
        postAudioConv(sendingAudio, recordingMimeType?.fileName ?? "audio.webm", {id: id, ms: messages}).then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    updateQueAudio(id, sent(getQueAudio(id)!))
                } else {
                    updateQueAudio(id, error(getQueAudio(id)!, r.statusText))
                }
            }
        ).catch((e: AxiosError) => {
            updateQueAudio(id, error(getQueAudio(id)!, e.message))
        })

        const audioId = uuidv4()
        addBlob({id: audioId, blob: sendingAudio}).then(() => {
            console.debug("saved audio blob, audioId: ", audioId)
            updateQueAudio(id, newAudioId(getQueAudio(id)!, audioId))
        }).catch((e) => {
            console.error("saved audio blob, audioId:", id, e.message)
        })

    }, [sendingAudio]);
    return null
}
