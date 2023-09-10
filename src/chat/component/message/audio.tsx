import React, {useEffect, useRef, useState} from 'react';
import WaveSurfer from 'wavesurfer.js';
import {useSnapshot} from "valtio/react";
import {MessageAudio} from "../../../state/data-structure/message.tsx";
import {audioDb} from "../../../state/db.ts";
import {clear, onPrevFinish, pause, play, playerState} from "../../../state/control-state.ts";
import Hover from 'wavesurfer.js/dist/plugins/hover'

interface AudioProps {
    audioSnp: MessageAudio
    loadAudio: boolean
    self: boolean
}

export const Audio: React.FC<AudioProps> = ({audioSnp, loadAudio, self}) => {
    const [audioUrl, setAudioUrl] = useState<string>("")
    useEffect(() => {
        if (loadAudio) {
            audioDb.getItem<Blob>(audioSnp.id, (blob:Blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob)
                    setAudioUrl(url)
                } else {
                    console.error("audio blob is empty, audioId:", audioSnp.id)
                }
            }).catch(e => {
                console.error("failed to get audio blob, audioId:", audioSnp.id, e)
            })
        }
    }, [audioSnp.id, loadAudio])

    return <Wave url={audioUrl} audioId={audioSnp.id} self={self}></Wave>
}

interface WaveSurferProps {
    url: string;
    audioId: string;
    self: boolean;
}

const Wave: React.FC<WaveSurferProps> = ({url, audioId, self}) => {

    const playerSnp = useSnapshot(playerState)
    const wavesurfer = useRef<WaveSurfer>();
    const container = useRef(null);
    const [amIPlaying, setAmIPlaying] = useState(false)
    const color = self ? selfColor : assistantColor

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: container.current!,
            waveColor: color.wave,
            progressColor: color.progress,
            cursorWidth: 0,
            barWidth: 4,
            barGap: 2,
            barRadius: 10,
            height: 'auto',
            url: url,
            plugins: [
                Hover.create({
                    lineColor: color.hoverLine,
                    lineWidth: 1,
                    labelBackground: color.labelBg,
                    labelColor: color.label,
                    labelSize: '11px',
                }),
            ],
        })

        wavesurfer.current!.on('interaction', () => {
            wavesurfer.current!.play().catch((e) => {
                console.error("can't play", e)
            })
        })

        wavesurfer.current.on('play', () => {
            play(audioId)
        })

        wavesurfer.current.on('pause', () => {
            pause()
        })

        wavesurfer.current.on('finish', () => {
            onPrevFinish()
        })

        wavesurfer.current.on('destroy', () => {
            clear()
        })

        // wavesurfer.current!
        return () => {
            wavesurfer.current && wavesurfer.current.destroy();
        };
    }, [audioId, color, url]);

    useEffect(() => {
        setAmIPlaying(playerSnp.isPlaying && playerSnp.current === audioId)
    }, [audioId, playerSnp]);

    useEffect(() => {
        if (wavesurfer.current) {
            if (amIPlaying) {
                if (!wavesurfer.current.isPlaying()) {
                    wavesurfer.current.play()
                }
            } else {
                if (wavesurfer.current.isPlaying()) {
                    wavesurfer.current.pause()
                }
            }
        }
    }, [amIPlaying]);

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

    return <div className={"flex rounded-2xl items-center p-1 gap-2 " + color.boxBg}>
        <div className={"flex justify-center items-center rounded-full w-10 h-10 shrink-0 " + color.playBg}
             onClick={togglePlay}>
            <div hidden={amIPlaying}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={color.play} viewBox="0 0 24 24"
                     className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
                </svg>
            </div>
            <div hidden={!amIPlaying}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={4}
                     stroke="currentColor" className={"w-6 h-6 " + color.pause}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
                </svg>
            </div>
        </div>
        <div ref={container} className="w-full h-10"/>
    </div>
};


type Color = {
    boxBg: string
    playBg: string
    play: string
    pause: string
    wave: string
    progress: string
    hoverLine: string
    labelBg: string
    label: string
}

const selfColor: Color = {
    boxBg: 'bg-blue-600',
    playBg: 'bg-blue-grey',
    play: 'white',
    pause: 'text-white',
    wave: 'rgb(128, 154, 241)',
    progress: 'rgb(213, 221, 250)',
    hoverLine: 'white',
    labelBg: '#94a3b8',
    label: 'white',
}

const assistantColor: Color = {
    boxBg: 'bg-neutral-200',
    playBg: 'bg-white',
    play: '#5e5e5e',
    pause: 'text-neutral-500',
    wave: '#8c8c8c',
    progress: '#2f2f2f',
    hoverLine: 'black',
    labelBg: '#d1d5db',
    label: 'black',
}
