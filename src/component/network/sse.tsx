import {useEffect} from 'react';
import {
    AbilityEvent,
    Answer,
    Audio,
    EventAbility,
    EventAnswer,
    EventAudio,
    EventTrans,
    Trans,
} from "../../api/sse/event.ts";
import {v4 as uuidv4} from "uuid";
import {useConvStore} from "../../state/conversation.tsx";
import {base64ToBlob} from "../../util/util.tsx";
import {audioPlayerMimeType, SSEEndpoint} from '../../config.ts';
import {useAuthStore} from "../../state/auth.tsx";
import {fetchEventSource} from '@microsoft/fetch-event-source';
import {useSSEStore} from "../../state/sse.tsx";
import {MyText, onError, onNewText} from "../../data-structure/text.tsx";
import {onError as errorAudio, onNewAudioId} from "../../data-structure/audio.tsx";
import {addBlob} from "../../persist/blob-db.tsx";
import {mergeAbility} from "../../data-structure/ability/client-ability.tsx";

export const SSE = () => {
        const getQueText = useConvStore((state) => state.getQueText)
        const updateQueText = useConvStore((state) => state.updateQueText)
        const getAnsText = useConvStore((state) => state.getAnsText)
        const updateAnsText = useConvStore((state) => state.updateAnsText)
        const getAnsAudio = useConvStore((state) => state.getAnsAudio)
        const updateAnsAudio = useConvStore((state) => state.updateAnsAudio)
        const passwordHash = useAuthStore((state) => state.passwordHash)
        const setVerified = useAuthStore((state) => state.setVerified)
        const setAbility = useConvStore((state) => state.setAbility)
        const streamId = useSSEStore((state) => state.streamId)

        useEffect(() => {
            const ep = SSEEndpoint()
            const url = ep + "?stream=" + streamId

            console.info("connecting to SSE: ", url);
            const ctrl = new AbortController();
            fetchEventSource(url, {
                signal: ctrl.signal,
                headers: {
                    'Authorization': 'Bearer ' + passwordHash,
                },
                keepalive: true,
                onopen: async (response: Response) => {
                    console.info("EventSource connected to server, response: ", response);
                },
                onmessage: (msg) => {
                    console.debug("received an msg from SSE server", msg.event, msg.data.slice(0, 100))
                    if (msg.event === EventAnswer) {
                        const answer: Answer = JSON.parse(msg.data)
                        const prev: MyText = getAnsText(answer.convId);
                        const now: MyText = answer.eMsg ? onError(prev, answer.eMsg) : onNewText(prev, answer.text, answer.eof)
                        updateAnsText(answer.convId, now)
                    } else if (msg.event == EventTrans) {
                        const trans: Trans = JSON.parse(msg.data)
                        const prev = getQueText(trans.convId);
                        const now = trans.eMsg ? onError(prev, trans.eMsg) : onNewText(prev, trans.text, true)
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
                                updateAnsAudio(audio.convId, onNewAudioId(getAnsAudio(audio.convId), blobId))
                            }).catch((e) => {
                                updateAnsAudio(audio.convId, errorAudio(getAnsAudio(audio.convId), e))
                                console.error("failed to save audio blobId", blobId, e)
                            })
                        }
                    } else if (msg.event === EventAbility) {
                        const ae: AbilityEvent = JSON.parse(msg.data)
                        const newAbility = mergeAbility(useConvStore.getState().ability, ae)
                        setAbility(newAbility)
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
        }, [streamId, passwordHash, getAnsAudio, getAnsText, getQueText, setAbility, setVerified, updateAnsAudio, updateAnsText, updateQueText])
        return null
    }
;
