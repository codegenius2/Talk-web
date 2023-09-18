import React, {useEffect, useRef, useState} from 'react';
import WaveSurfer from 'wavesurfer.js';
import {Message, MessageAudio} from "../../../data-structure/message.tsx";
import {audioDb} from "../../../state/db.ts";
import {clearPlayList, controlState, onFinish, pauseMe, play} from "../../../state/control-state.ts";
import Hover from 'wavesurfer.js/dist/plugins/hover'
import {Theme} from "./theme.ts";
import {cx, formatAgo, formatAudioDuration} from "../../../util/util.tsx";
import {BsCheck2Circle} from "react-icons/bs";
import {MySpin} from "./widget/icon.tsx";
import {CgDanger} from "react-icons/cg";
import {subscribe} from "valtio";

interface AudioProps {
    audioSnap: MessageAudio
    chatId: string
    messageSnap: Message
    loadAudio: boolean
    theme: Theme
}

export const Audio: React.FC<AudioProps> = ({
                                                audioSnap, chatId, messageSnap, loadAudio, theme
                                            }) => {

    const wavesurfer = useRef<WaveSurfer>();
    const container = useRef(null);
    const [amIPlaying, setAmIPlaying] = useState(false)
    const [load, setLoad] = useState(false)
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (load) {
            if (audioSnap.id) {
                audioDb.getItem<Blob>(audioSnap.id, (err, blob) => {
                    if (err) {
                        console.warn("failed to loaded audio blob, audioId:", audioSnap.id, err)
                        return
                    }
                    if (blob) {
                        const url = URL.createObjectURL(blob)
                        setUrl(url)
                    } else {
                        console.error("audio blob is empty, audioId:", audioSnap.id)
                    }
                }).then(() => true)
            }
        }
    }, [audioSnap.id, loadAudio, load])

    useEffect(() => {
        setLoad(loadAudio)
    }, [loadAudio]);

    useEffect(() => {
            if (!load || !url) {
                return
            }
            wavesurfer.current = WaveSurfer.create({
                container: container.current!,
                waveColor: theme.wave,
                progressColor: theme.progress,
                cursorWidth: 0,
                barWidth: 4,
                dragToSeek: true,
                autoScroll: false,
                hideScrollbar: true,
                barGap: 2,
                barRadius: 10,
                height: 'auto',
                url: url,
                plugins: [
                    Hover.create({
                        lineColor: theme.hoverLine,
                        lineWidth: 1,
                        labelBackground: theme.labelBg,
                        labelColor: theme.label,
                        labelSize: '11px',
                    }),
                ],
            })
            const current = wavesurfer.current

            current.on('interaction', () => {
                clearPlayList()
                current!.play().catch((e) => {
                    console.error("can't play", e)
                })
            })

            current.on('play', () => {
                play(audioSnap.id)
                setAmIPlaying(true)
            })

            current.on('pause', () => {
                pauseMe(audioSnap.id)
                setAmIPlaying(false)
            })

            current.on('finish', () => {
                onFinish(audioSnap.id)
                setAmIPlaying(false)
            })

            const player = controlState.player

            const syncWithPlayer = () => {
                if (player.current === audioSnap.id
                    && player.isPlaying
                    && !current.isPlaying()) {
                    console.debug(audioSnap.id + " want to play ", player)
                    current.play().catch((e) => {
                        console.error("can't play", e)
                    })
                } else if (player.current !== audioSnap.id &&
                    current.isPlaying()) {
                    console.debug(audioSnap.id + " want to pause, ", player)
                    current.pause()
                }
            }
            let unSub: () => void;
            current.on('ready', () => {
                syncWithPlayer()
                unSub = subscribe(controlState.player, () => {
                    syncWithPlayer()
                })
                const durationSec = current?.getDuration()
                if (durationSec && audioSnap.durationMs === undefined) {
                    controlState.audioDurationUpdates.push(
                        {
                            chatId: chatId,
                            messageId: messageSnap.id,
                            durationMs: durationSec * 1000
                        }
                    )
                    controlState.audioDurationUpdateSignal++
                }
            })

            return () => {
                unSub && unSub()
                onFinish(audioSnap.id)
                current.destroy();
            };

            // exclude audioSnap.durationMS from deps
            // eslint-disable-next-line
        }, [audioSnap.id, theme, url, load, chatId, messageSnap.id]
    )

    const togglePlay = () => {
        if (!wavesurfer.current) {
            return
        }
        if (wavesurfer.current.isPlaying()) {
            wavesurfer.current.pause()
        } else {
            wavesurfer.current.play().catch((e) => {
                console.error("can't play", e)
            })
        }
    };

    return (
        <div className={cx("flex flex-col rounded-2xl px-1 pt-1 pb-0.5", theme.text, theme.bg)}
             onClick={() => setLoad(true)}
        >
            <div className={"relative flex px-1 items-center gap-2 "}>
                <div className={"flex justify-center items-center rounded-full w-10 h-10 shrink-0 " + theme.playBg}
                     onClick={togglePlay}>
                    <div hidden={amIPlaying}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={theme.play} viewBox="0 0 24 24"
                             className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
                        </svg>
                    </div>
                    <div hidden={!amIPlaying}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={4}
                             stroke="currentColor" className={"w-6 h-6 " + theme.pause}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
                        </svg>
                    </div>
                </div>
                <div ref={container} className="h-10 w-full">
                </div>
                {!load &&
                    <div className={cx("absolute w-full h-full flex justify-center items-center", theme.text)}>
                        Click to Load
                    </div>
                }
            </div>
            <div className={"flex pl-1 pr-3 justify-between gap-1 pointer-events-none"}>
                <p className="text-xs inline w-10 text-center"
                   data-pseudo-content={formatAudioDuration(audioSnap.durationMs)}></p>
                <div className="flex justify-end items-center gap-1">
                    <p className="text-xs inline" data-pseudo-content={formatAgo(messageSnap.createdAt)}></p>
                    {['sent', 'received'].includes(messageSnap.status) &&
                        <BsCheck2Circle className={"h-4 w-4" + theme.normalIcon}/>
                    }
                    {messageSnap.status === 'sending' &&
                        <MySpin className={"h-4 w-4 " + theme.normalIcon}/>
                    }
                    {messageSnap.status === 'error' &&
                        <div className="leading-none">
                            <CgDanger className={"w-4 h-4 mr-1 inline " + theme.warningIcon}/>
                            <p className="text-xs inline">{messageSnap.errorMessage}</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
};