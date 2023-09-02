import {v4 as uuidv4} from "uuid";
import {useConvStore} from "../state/conversation.tsx";
import {newQueAns} from "../ds/conversation.tsx";
import React, {useEffect} from "react";
import {useSendingAudioStore} from "../state/input.tsx";
import {historyMessages, RecordingMimeType} from "../util/util.tsx"
import {useRecorderStore} from "../state/recording.tsx";
import {addBlob} from "../store/blob-db.tsx";
import {newMyText} from "../ds/text.tsx";
import {newAudio, onError, onNewAudioId, onSent} from "../ds/audio.tsx";
import {Message} from "../api/restful.ts";
import {postAudioConv} from "../api/axios.ts";
import {minSpeakTimeMillis} from "../config.ts";
import {AxiosError} from "axios";
import {maxHistory} from "../ds/ability/client-ability.tsx";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscribeSendingAudio: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const ability = useConvStore((state) => state.ability)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const updateQueAudio = useConvStore((state) => (state.updateQueAudio))
    const getQueAudio = useConvStore((state) => (state.getQueAudio))
    const sendingAudio = useSendingAudioStore((state) => state.sendingAudio)
    const duration = useSendingAudioStore((state) => state.duration)
    const recordingMimeType: RecordingMimeType | undefined = useRecorderStore((state) => state.recordingMimeType)
    useEffect(() => {
        if (sendingAudio.length === 0) {
            console.warn("audio blob is empty")
            return
        }

        if (duration < minSpeakTimeMillis) {
            console.info("audio is less than ms", minSpeakTimeMillis)
            return
        }

        const id = uuidv4()
        let messages = historyMessages(qaSlice, maxHistory(ability.llm))
        messages = [systemMessage, ...messages]

        const qa = newQueAns(id, false, newMyText('receiving', ""), newAudio("sending"))
        pushQueAns(qa)
        postAudioConv(sendingAudio, recordingMimeType?.fileName ?? "audio.webm", {id: id, ms: messages}).then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    updateQueAudio(id, onSent(getQueAudio(id)!))
                } else {
                    updateQueAudio(id, onError(getQueAudio(id)!, r.statusText))
                }
            }
        ).catch((e: AxiosError) => {
            updateQueAudio(id, onError(getQueAudio(id)!, e.message))
        })

        const audioId = uuidv4()
        addBlob({id: audioId, blob: sendingAudio}).then(() => {
            console.debug("saved audio blob, audioId: ", audioId)
            updateQueAudio(id, onNewAudioId(getQueAudio(id)!, audioId))
        }).catch((e) => {
            console.error("saved audio blob, audioId:", id, e.message)
        })

    }, [sendingAudio]);
    return null
}
