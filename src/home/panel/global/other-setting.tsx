import React, {useCallback} from 'react'
import {CountDownButton, ResetButton} from "../shared/widget/button.tsx"
import {appState} from "../../../state/app-state.ts"
import {BsTrash3} from "react-icons/bs"
import {MySwitch} from "../shared/widget/switch.tsx"
import {useSnapshot} from "valtio/react"
import {SelectBoxOrNotAvailable} from "../shared/select-box-or-not-available.tsx"
import {allArts} from "../../../wallpaper/art.tsx"
import {PiButterflyThin} from "react-icons/pi";
import {clearChats} from "../../../state/dangerous.ts";

export const OtherSetting: React.FC = () => {
    const {butterflyOnAttachedMessage, wallpaper} = useSnapshot(appState.pref)

    const showButterfly = useCallback((enabled: boolean) => {
        appState.pref.butterflyOnAttachedMessage = enabled
    }, [])

    const setWallpaperIndex = useCallback((value?: number) => {
        appState.pref.wallpaper.index = value ?? 0
    }, [])

    const setWallpaperPreviewIndex = useCallback((value?: number) => {
        appState.pref.wallpaper.previewIndex = value
    }, [])
    return <div
        className="relative flex h-full select-none flex-col w-full before:bg-white before:bg-opacity-40
         pt-1 pb-3 px-3 gap-1 before:backdrop-hack before:backdrop-blur before:rounded-xl">
        <div className="flex justify-between items-center w-full px-3 ">
            <p className="prose text-lg text-neutral-600">Other</p>
        </div>
        <div
            className="flex flex-col justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed
            rounded-lg px-3 w-full">
            <div className="flex justify-between items-center w-full ">

                <div className="flex items-center gap-1">
                    <PiButterflyThin className="w-5 h-5 select-none -rotate-45 fill-neutral-600 stroke-2"/>
                    <p className="prose text text-neutral-600">
                        on Attached Messages
                    </p>
                </div>
                <MySwitch enabled={butterflyOnAttachedMessage} setEnabled={showButterfly}/>
            </div>
            <div className="w-full">
                <SelectBoxOrNotAvailable
                    title={"Wallpaper"}
                    choices={allArts.map((art, index) => ({
                            name: art.name,
                            value: index,
                            tags: [art.author, art.date]
                        })
                    )}
                    defaultValue={wallpaper.index}
                    setValue={setWallpaperIndex}
                    hoverOnValue={setWallpaperPreviewIndex}
                />
            </div>
            <div className="flex flex-wrap pt-10 pb-2 w-full gap-2">
                <CountDownButton text={"Clear All Chats"}
                                 countDownMs={1000}
                                 color="red"
                                 action={clearChats}
                                 icon={<BsTrash3 className="text-lg"/>}
                />
                <ResetButton countDownMs={2000}/>
            </div>
        </div>
    </div>
}

