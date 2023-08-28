import {useEffect} from 'react';
import {Answer, Audio, EventAnswer, EventAudio, EventTrans, Trans,} from "./api/Interface.tsx";
import {v4 as uuidv4} from "uuid";
import {useConvStore} from "./state/ConversationStore.tsx";
import {base64ToBlob} from "./Util.tsx";
import {addBlob} from "./store/BlobDB.tsx";
import {SSEEndpoint} from "./instance.ts";
import {error, MyText, newText} from "./ds/Text.tsx";
import {error as errorAudio, newAudioId,} from "./ds/Audio.tsx";

export const SSE = () => {
    const getQueText = useConvStore((state) => state.getQueText)
    const updateQueText = useConvStore((state) => state.updateQueText)
    const getAnsText = useConvStore((state) => state.getAnsText)
    const updateAnsText = useConvStore((state) => state.updateAnsText)
    const getAnsAudio = useConvStore((state) => state.getAnsAudio)
    const updateAnsAudio = useConvStore((state) => state.updateAnsAudio)

    useEffect(() => {
        const ep = SSEEndpoint()
        console.info("connecting to SSE: ", ep);
        const eventSource = new EventSource(ep);

        eventSource.onopen = (event) => {
            console.info("EventSource connected to server: ", event);
        }

        eventSource.onerror = (event) => {
            console.error("EventSource error: ", event);
        }

        eventSource.addEventListener(EventAnswer, (event: MessageEvent<string>) => {
            const answer: Answer = JSON.parse(event.data)
            const prev: MyText = getAnsText(answer.convId);
            const now: MyText = answer.eMsg ? error(prev,answer.eMsg) : newText(prev,answer.text, answer.eof)
            updateAnsText(answer.convId, now)
        })
        eventSource.addEventListener(EventTrans, (event: MessageEvent<string>) => {
            const trans: Trans = JSON.parse(event.data)
            const prev = getQueText(trans.convId);
            const now = trans.eMsg ? error(prev,trans.eMsg) : newText(prev,trans.text, true)
            updateQueText(trans.convId, now)
        })
        eventSource.addEventListener(EventAudio, (event: MessageEvent<string>) => {
            const audio: Audio = JSON.parse(event.data)
            if (audio.eMsg) {
                updateAnsAudio(audio.convId, errorAudio(getAnsAudio(audio.convId),audio.eMsg))
            } else {
                const blob = base64ToBlob(audio.audio);
                const blobId = uuidv4()
                addBlob({id: blobId, blob: blob}).then(() => {
                    console.debug("saved audio, blobId:", blobId)
                    updateAnsAudio(audio.convId, newAudioId(getAnsAudio(audio.convId),blobId))
                }).catch((e) => {
                    updateAnsAudio(audio.convId, errorAudio(getAnsAudio(audio.convId),e))
                    console.error("failed to save audio blobId", blobId, e)
                })
            }
        })

        return () => {
            eventSource.close();
        };
    }, []);

    return null
};
