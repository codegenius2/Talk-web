import {v4 as uuidv4} from "uuid";
import {useConvStore} from "../state/ConversationStore.tsx";
import {useSettingStore} from "../state/Setting.tsx";
import {newQueAns} from "../ds/Conversation.tsx";
import React, {useEffect} from "react";
import {useSendingAudioStore} from "../state/Input.tsx";
import {historyMessages} from "../Util.tsx";
import {useRecorderStore} from "../state/Recording.tsx";
import {addBlob} from "../store/BlobDB.tsx";
import {newMyText} from "../ds/Text.tsx";
import {error, newAudio, newAudioId, sent} from "../ds/Audio.tsx";
import {Message} from "../api/Interface.tsx";
import {postAudioConv} from "../instance.ts";

const systemMessage: Message = {
    role: "system",
    content: "You are a helpful assistant!"
}

export const SubscribeSendingAudio: React.FC = () => {

    const qaSlice = useConvStore((state) => state.qaSlice)
    const maxHistoryMessage = useSettingStore((state) => state.maxHistoryMessage)
    const pushQueAns = useConvStore((state) => (state.pushQueAns))
    const updateQueAudio = useConvStore((state) => (state.updateQueAudio))
    const getQueAudio = useConvStore((state) => (state.getQueAudio))
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

        const qa = newQueAns(id, newMyText('receiving', ""), newAudio("sending"))
        pushQueAns(qa)
        postAudioConv(sendingAudio, {id: id, ms: messages}).then((r) => {
                if (r.status >= 200 && r.status < 300) {
                    updateQueAudio(id, sent(getQueAudio(id)!))
                } else {
                    updateQueAudio(id, error(getQueAudio(id)!, r.statusText))
                }
            }
        ).catch((e) => {
            updateQueAudio(id, error(getQueAudio(id)!, e))
        })

        const audioId = uuidv4()
        addBlob({id: audioId, blob: sendingAudio}).then(() => {
            console.debug("saved audio blob, audioId: ", audioId)
            updateQueAudio(id, newAudioId(getQueAudio(id)!, audioId))
        }).catch((e) => {
            console.error("saved audio blob, audioId:", id, e)
        })

    }, [sendingAudio]);
    return null
}
