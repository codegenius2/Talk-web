import {cx} from "../util/util.tsx";
import React, {useCallback, useEffect, useState} from "react";
import {allArts, Art} from "./art.tsx";
import {useSnapshot} from "valtio/react";
import {appState} from "../state/app-state.ts";


export const TheWallpaper = () => {
    const {previewIndex, index} = useSnapshot(appState.pref.wallpaper)
    return (
        <Wallpaper art={allArts[previewIndex ?? index ?? 0 % allArts.length]}/>
    )
}

const defaultImageClassName = "bg-cover bg-center blur brightness-75"
const defaultNoiseClassname = "opacity-80 brightness-100"

type Props = {
    art: Art
}

const Wallpaper: React.FC<Props> = ({art}) => {
    const [showInfo, setShowInfo] = useState(true)
    const [timer, setHideOnTime] = useState<NodeJS.Timeout>()

    const clearTimer = useCallback(() => {
        if (timer) {
            clearTimeout(timer)
        }
        setShowInfo(true)
    }, [timer]);

    const startNewTimer = useCallback(() => {
        if (timer) {
            clearTimeout(timer)
        }
        const t = setTimeout(() => setShowInfo(false), 5e3)
        setHideOnTime(t)
    }, [timer]);

    useEffect(() => {
        if (timer) {
            clearTimeout(timer)
        }
        setShowInfo(true)
        const t = setTimeout(() => setShowInfo(false), 5e3)
        setHideOnTime(t)
        return () => clearTimeout(t)
    }, [art]);

    return (
        <div className="">
            <div
                style={{backgroundImage: `url("${art.imageUrl}")`}}
                className={cx("fixed -mt-5 -ml-5 w-screen-105 h-screen-105 -z-50",
                    art.imageClassName ?? defaultImageClassName
                )}/>
            <div className={cx("fixed h-full w-full bg-noise -z-50", art.noiseClassname ?? defaultNoiseClassname)}/>
            <div
                onMouseOver={clearTimer}
                onMouseLeave={startNewTimer}
                className={cx(
                    "fixed bottom-0 pt-10 pr-10 left-2 flex flex-col justify-end opacity-0 transition duration-1000",
                    showInfo ? "opacity-100" : "opacity-0"
                )}>
                <a href={art.pageUrl} target="_blank">
                    <p className="max-w-[14rem] truncate ... hover:overflow-visible leading-none text-neutral-800 decoration-solid
                    decoration-1 underline-offset-1 font hover:underline">{art.name}</p>
                </a>
                <div
                    className="max-w-[14rem] truncate ...  hover:overflow-visible flex items-center justify-start gap-1">
                    <p className="text-sm text-neutral-700">{art.author},</p>
                    <p className="text-sm text-neutral-700">{art.date}</p>
                </div>
            </div>
        </div>
    )
}