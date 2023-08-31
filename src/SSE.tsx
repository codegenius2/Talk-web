import {useEffect} from 'react';
import {Answer, Audio, EventAnswer, EventAudio, EventTrans, Trans,} from "./api/sse-event.ts";
import {v4 as uuidv4} from "uuid";
import {useConvStore} from "./state/ConversationStore.tsx";
import {addBlob} from "./store/BlobDB.tsx";
import {SSEEndpoint} from "./api/axios.ts";
import {error, MyText, newText} from "./ds/Text.tsx";
import {error as errorAudio, newAudioId,} from "./ds/Audio.tsx";
import {base64ToBlob} from "./util/Util.tsx";
import {audioPlayerMimeType} from './config.ts';
import {useAuthStore} from "./state/Auth.tsx";
import {fetchEventSource} from '@microsoft/fetch-event-source';

export const SSE = () => {
        const getQueText = useConvStore((state) => state.getQueText)
        const updateQueText = useConvStore((state) => state.updateQueText)
        const getAnsText = useConvStore((state) => state.getAnsText)
        const updateAnsText = useConvStore((state) => state.updateAnsText)
        const getAnsAudio = useConvStore((state) => state.getAnsAudio)
        const updateAnsAudio = useConvStore((state) => state.updateAnsAudio)
        const passwordHash = useAuthStore((state) => state.passwordHash)
        const setVerified = useAuthStore((state) => state.setVerified)

        useEffect(() => {
            const ep = SSEEndpoint()
            console.info("connecting to SSE: ", ep);
            const ctrl = new AbortController();
            fetchEventSource(ep, {
                signal: ctrl.signal,
                headers: {
                    'Authorization': 'Bearer ' + passwordHash,
                },
                keepalive: true,
                onopen: async (response: Response) => {
                    console.info("EventSource connected to server, response: ", response);
                    if (200 <= response.status && response.status < 300) {
                        setVerified(true)
                    }
                },
                onmessage: (msg) => {
                    console.debug("received an msg from SSE server", msg.event, msg.data.slice(0, 100))
                    if (msg.event === EventAnswer) {
                        const answer: Answer = JSON.parse(msg.data)
                        const prev: MyText = getAnsText(answer.convId);
                        const now: MyText = answer.eMsg ? error(prev, answer.eMsg) : newText(prev, answer.text, answer.eof)
                        updateAnsText(answer.convId, now)
                    } else if (msg.event == EventTrans) {
                        const trans: Trans = JSON.parse(msg.data)
                        const prev = getQueText(trans.convId);
                        const now = trans.eMsg ? error(prev, trans.eMsg) : newText(prev, trans.text, true)
                        updateQueText(trans.convId, now)
                    } else if (msg.event == EventAudio) {
                        const audio: Audio = JSON.parse(msg.data)
                        if (audio.eMsg) {
                            updateAnsAudio(audio.convId, errorAudio(getAnsAudio(audio.convId), audio.eMsg))
                        } else {
                            const blob = base64ToBlob(audio.audio, audioPlayerMimeType);
                            const blobId = uuidv4()
                            addBlob({id: blobId, blob: blob}).then(() => {
                                console.debug("saved audio, blobId:", blobId)
                                updateAnsAudio(audio.convId, newAudioId(getAnsAudio(audio.convId), blobId))
                            }).catch((e) => {
                                updateAnsAudio(audio.convId, errorAudio(getAnsAudio(audio.convId), e))
                                console.error("failed to save audio blobId", blobId, e)
                            })
                        }
                    } else {
                        console.warn("unknown event type:", msg.event)
                    }
                },
                onerror: (err) => {
                    console.error("SSE error", err)
                }
            })
            return () => {
                ctrl.abort("passwordHash changed")
            }
        }, [passwordHash])
        return null
    }
;
