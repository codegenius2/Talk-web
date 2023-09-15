import React, {useEffect, useRef, useState} from 'react';
import WaveSurfer from 'wavesurfer.js';
import {useSnapshot} from "valtio/react";
import {MessageAudio} from "../../../data-structure/message.tsx";
import {audioDb} from "../../../state/db.ts";
import {clear, onPrevFinish, pause, play, playerState} from "../../../state/control-state.ts";
import Hover from 'wavesurfer.js/dist/plugins/hover'

interface AudioProps {
    audioSnap: MessageAudio
    loadAudio: boolean
    theme: 'blue' | 'neutral'
}

export const Audio: React.FC<AudioProps> = ({audioSnap, loadAudio, theme}) => {
    const [audioUrl, setAudioUrl] = useState<string>("")
    useEffect(() => {
        if (loadAudio) {
            if (audioSnap.id) {
                audioDb.getItem<Blob>(audioSnap.id, (err, blob) => {
                    if (err) {
                        console.error("failed to loaded audio blob, audioId:", audioSnap.id, err)
                        return
                    }
                    if (blob) {
                        const url = URL.createObjectURL(blob)
                        console.info("audio blob loaded:", audioSnap.id, url)
                        setAudioUrl(url)
                    } else {
                        console.error("audio blob is empty, audioId:", audioSnap.id)
                    }
                })
            }
        }
    }, [audioSnap.id, loadAudio])

    const playerSnap = useSnapshot(playerState)
    const wavesurfer = useRef<WaveSurfer>();
    const container = useRef(null);
    const [amIPlaying, setAmIPlaying] = useState(false)
    const [style] = useState(theme === 'blue' ? blueColor : neutralColor)

    useEffect(() => {
        console.debug("wave style:", style)
        console.debug("container.current:", container.current)
        wavesurfer.current = WaveSurfer.create({
            container: container.current!,
            waveColor: style.wave,
            progressColor: style.progress,
            cursorWidth: 0,
            barWidth: 4,
            barGap: 2,
            barRadius: 10,
            height: 'auto',
            url: audioUrl,
            plugins: [
                Hover.create({
                    lineColor: style.hoverLine,
                    lineWidth: 1,
                    labelBackground: style.labelBg,
                    labelColor: style.label,
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
            play(audioSnap.id)
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
    }, [audioSnap.id, theme, audioUrl, style]);

    useEffect(() => {
        // eslint-disable-next-line valtio/state-snapshot-rule
        setAmIPlaying(playerSnap.isPlaying && playerSnap.current === audioSnap.id)
    }, [audioSnap.id, playerSnap]);

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

    return <div className={"flex rounded-2xl items-center p-1 gap-2 " + style.boxBg}>
        <div className={"flex justify-center items-center rounded-full w-10 h-10 shrink-0 " + style.playBg}
             onClick={togglePlay}>
            <div hidden={amIPlaying}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={style.play} viewBox="0 0 24 24"
                     className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
                </svg>
            </div>
            <div hidden={!amIPlaying}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={4}
                     stroke="currentColor" className={"w-6 h-6 " + style.pause}>
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

const blueColor: Color = {
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

const neutralColor: Color = {
    boxBg: 'bg-neutral-100 bg-opacity-80 backdrop-blur',
    playBg: 'bg-white',
    play: '#5e5e5e',
    pause: 'text-neutral-500',
    wave: '#8c8c8c',
    progress: '#2f2f2f',
    hoverLine: 'black',
    labelBg: '#d1d5db',
    label: 'black',
}
