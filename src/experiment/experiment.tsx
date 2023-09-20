import {cx, getRandomElement} from "../util/util.tsx";
import React from "react";
import {Art, wikiarts} from "../wallpaper/art.tsx";


export const Experiment = () => {
    const art = getRandomElement(...wikiarts)
    return (
        <Wallpaper {...art}/>
    )
}

const Wallpaper: React.FC<Art> = ({
                                      author,
                                      name,
                                      date,
                                      imageUrl,
                                      pageUrl,
                                      imageClassName = "bg-cover bg-center blur brightness-75",
                                      noiseClassname = "opacity-80 brightness-100"
                                  }) => {
    return (
        <div className="">
            <div
                style={{backgroundImage: `url("${imageUrl}")`}}
                className={cx("fixed -mt-5 -ml-5 w-screen-105 h-screen-105 -z-50",
                    imageClassName
                )}/>
            <div className={cx("fixed h-full w-full bg-noise -z-50", noiseClassname)}/>
            <div
                className="fixed bottom-0 pt-10 pr-10 left-2 flex flex-col justify-end opacity-0 transition duration-500 hover:opacity-100">
                <div className="flex-grow text-transparent"></div>
                <a href={pageUrl} target="_blank">
                    <p className="max-w-[14rem] truncate ...  hover:overflow-visible leading-none text-neutral-800 decoration-solid
                    decoration-1 underline-offset-1 font hover:underline">{name}</p>
                </a>
                <div
                    className="max-w-[14rem] truncate ...  hover:overflow-visible flex items-center justify-start gap-1">
                    <p className="text-sm text-neutral-700">{author},</p>
                    <p className="text-sm text-neutral-700">{date}</p>
                </div>
            </div>
        </div>
    )
}