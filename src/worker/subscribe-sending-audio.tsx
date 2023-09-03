import {v4 as uuidv4} from "uuid";
import {useConvStore} from "../state/conversation.tsx";
import {newQueAns} from "../data-structure/conversation.tsx";
import React, {useEffect} from "react";
import {useSendingAudioStore} from "../state/input.tsx";
import {useRecorderStore} from "../state/recording.tsx";
import {addBlob} from "../persist/blob-db.tsx";
import {newMyText} from "../data-structure/text.tsx";
import {newAudio, onError, onNewAudioId, onSent} from "../data-structure/audio.tsx";
import {Message, toTalkOption} from "../api/restful.ts";
import {minSpeakTimeMillis, RecordingMimeType} from "../config.ts";
import {AxiosError} from "axios";
import {maxHistory} from "../data-structure/ability/client-ability.tsx";
import {useRestfulAPIStore} from "../state/axios.tsx";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscribeSendingAudio: React.FC = () => {

    const historyMessages = useConvStore((state) => state.historyMessages)
    const ability = useConvStore((state) => state.ability)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const updateQueAudio = useConvStore((state) => (state.updateQueAudio))
    const getQueAudio = useConvStore((state) => (state.getQueAudio))
    const pop = useSendingAudioStore((state) => state.pop)
    const sendingAudios = useSendingAudioStore((state) => state.sendingAudios)
    const recordingMimeType: RecordingMimeType | undefined = useRecorderStore((state) => state.recordingMimeType)
    const restfulAPI = useRestfulAPIStore((state) => state.restfulAPI);

    useEffect(() => {
        if (sendingAudios.length === 0) {
            return;
        }
        const sendingAudio = pop();
        if (!sendingAudio) {
            return
        }

        if (sendingAudio.duration < minSpeakTimeMillis) {
            console.info("audio is less than ms", minSpeakTimeMillis)
            return
        }

        const id = uuidv4()
        let messages = historyMessages(maxHistory(ability.llm))
        messages = [systemMessage, ...messages]
        console.debug("sending conversation: ", messages)

        const qa = newQueAns(id, false, newMyText('receiving', ""), newAudio("sending"))
        pushQueAns(qa)
        restfulAPI.postAudioConv(sendingAudio.blob, recordingMimeType?.fileName ?? "audio.webm", {
            id: id,
            ms: messages,
            talkOption: toTalkOption(ability)
        }).then((r) => {
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
        addBlob({id: audioId, blob: sendingAudio.blob}).then(() => {
            console.debug("saved audio blob, audioId: ", audioId)
            updateQueAudio(id, onNewAudioId(getQueAudio(id)!, audioId))
        }).catch((e) => {
            console.error("saved audio blob, audioId:", id, e.message)
        })

    }, [sendingAudios, restfulAPI, ability, getQueAudio, pushQueAns, recordingMimeType, updateQueAudio]);
    return null
}
