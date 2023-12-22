/// <reference types="vite-plugin-svgr/client" />
// see https://github.com/pd4d10/vite-plugin-svgr#usage
import GoogleSVG from "../../../../assets/svg/Google_2015_logo.svg?react"
import OpenAISVG from "../../../../assets/svg/openai-icon.svg?react"
import GeminiIco from "../../../../assets/svg/gemini.ico"

import {HiPause} from "react-icons/hi2"

export const GoogleLogo = () => <GoogleSVG className={"w-auto h-5 pl-1 brightness-110"}/>

export const ChatGPTLogo = () => (
    <div className="flex items-center gap-1">
        <OpenAISVG className={"h-[1.375rem] p-0.5 rounded-md fill-[#389C6F] bg-neutral-100/[0.9]"}/>
        <div className="text-lg text-neutral-600">ChatGPT</div>
    </div>
)

export const GeminiLogo = () => (
    <div className="flex items-center gap-1">
        <img className={"h-[1.375rem] p-0.5 rounded-md fill-[#389C6F] bg-neutral-100/[0.9]"}
             src={GeminiIco}
             alt="GeminiIco"/>
        <div className="text-lg text-neutral-600">Gemini</div>
    </div>
)

export const WhisperGPTLogo = () => (
    <div className="flex items-center gap-1">
        <OpenAISVG className={"h-[1.375rem] p-0.5 rounded-md fill-[#389C6F] bg-neutral-100/[0.9]"}/>
        <div className="text-lg text-neutral-600">Whisper</div>
    </div>
)
export const ElevenlabsLogoSimple = () => <HiPause className="h-7 w-7 rounded-lg bg-neutral-50 p-1"/>
export const ElevenlabsLogoPureText = () => (
    <div
        className="flex rounded-md bg-neutral-100/[0.9] px-1 py-1 font-medium leading-none text-neutral-600
     items-centerleading-none">
        IIElevenLabs
    </div>
)
export const ElevenlabsLogo = () => (
    <div className="flex items-center gap-1">
        <HiPause className="h-[1.375rem] w-[1.375rem] p-0.5 rounded-md fill-neutral-600  bg-neutral-100/[0.9]"/>
        <div className="text-lg text-neutral-600">Elevenlabs</div>
    </div>
)
