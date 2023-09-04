import React, {useCallback, useEffect, useRef, useState} from 'react';
import WaveSurfer from 'wavesurfer.js';
import Hover from 'wavesurfer.js/plugins/hover'
import {Audio as _Audio} from "../data-structure/audio.tsx"
import {Spin} from "./spin.tsx";
import {usePlayingStore} from "../state/playing.tsx";
import {getBlob} from "../persist/blob-db.tsx";

interface WaveSurferProps {
    url: string;
    audioIndex: string;
    self: boolean;
}

interface AudioProps {
    audio?: _Audio
    self: boolean
    delay: number // ms, delay rendering of audios not in window
}

export const Audio: React.FC<AudioProps> = ({audio, self, delay}) => {
    const [audioUrl, setAudioUrl] = useState<string>("")

    const update = useCallback((id: string) => getBlob(id).then(r => {
        if (r) {
            const url = URL.createObjectURL(r.blob)
            setAudioUrl(url)
        } else {
            console.error("audio blob not found")
        }
    }).catch(e => {
        console.error("failed to get audio blob", id, e)
    }), [])

    useEffect(() => {
            if (!audio) {
                return
            }
            if (audioUrl) {
                return;
            }
            let timeout: NodeJS.Timeout
            if (['sent', 'received'].includes(audio.status)) {
                if (audio.audioId) {
                    const id = audio.audioId
                    if (delay == 0) {
                        update(id)
                    } else {
                        timeout = setTimeout(()=>update(id),delay)
                    }
                }
            }
            return () => clearTimeout(timeout)
        }, [audio, audioUrl]
    )

    if (!audio) {
        return <></>
    }

    switch (audio.status) {
        case 'sending':
        case 'receiving':
            return <div className="w-auto px-2 py-1.5">
                <Spin/>
            </div>
        case 'sent':
        case 'received':
            return <Wave url={audioUrl} audioIndex={audio.audioId!} self={self}></Wave>
        case 'error':
            return <div> {audio.errorMessage}</div>
        default:
            console.log('impossible audio status', audio.status)
            break;
    }
}

const Wave: React.FC<WaveSurferProps> = ({url, audioIndex, self}) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef<WaveSurfer>();
    const playingAudioIndex = usePlayingStore((state) => state.playingAudioIndex)
    const forceLock = usePlayingStore((state) => state.forceLock)
    const unLock = usePlayingStore((state) => state.unLock)

    const color = self ? selfColor : assistantColor

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current!,
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
            wavesurfer.current!.play().then(() => {
                forceLock(audioIndex)
            }).catch((e) => {
                console.error("can't play", e)
            })
        })

        wavesurfer.current.on('finish', () => {
            unLock(audioIndex)
        })

        // wavesurfer.current!
        return () => {
            wavesurfer.current && wavesurfer.current.destroy();
        };
    }, [url, audioIndex]);

    const playPause = () => {
        if (wavesurfer.current!.isPlaying()) {
            wavesurfer.current!.pause()
            unLock(audioIndex)
        } else {
            wavesurfer.current!.play().catch((e) => {
                console.error("can't play", e)
            })
            forceLock(audioIndex)
        }
    };

    useEffect(() => {
        if (playingAudioIndex !== audioIndex && wavesurfer.current?.isPlaying()) {
            wavesurfer.current!.pause()
        }
    }, [playingAudioIndex, audioIndex]);

    return <div className={"flex rounded-2xl items-center p-1 gap-2 " + color.boxBg}>
        <div className={"flex justify-center items-center rounded-full w-10 h-10 shrink-0 " + color.playBg}
             onClick={playPause}>
            <div hidden={playingAudioIndex === audioIndex}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={color.play} viewBox="0 0 24 24"
                     className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
                </svg>
            </div>
            <div hidden={playingAudioIndex !== audioIndex}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={4}
                     stroke="currentColor" className={"w-6 h-6 " + color.pause}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
                </svg>
            </div>
        </div>
        <div ref={waveformRef} className="w-full h-10"/>
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
