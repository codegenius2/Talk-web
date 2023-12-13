import React, {useCallback, useRef} from 'react'
import {CountDownButton, ResetButton} from "../shared/widget/button.tsx"
import {appState} from "../../../state/app-state.ts"
import {BsTrash3} from "react-icons/bs"
import {MySwitch} from "../shared/widget/switch.tsx"
import {useSnapshot} from "valtio/react"
import {SelectBoxOrNotAvailable} from "../shared/select-box-or-not-available.tsx"
import {allArts} from "../../../wallpaper/art.tsx"
import {PiButterflyThin} from "react-icons/pi";
import {clearChats} from "../../../state/dangerous.ts";
import {Separator} from "../shared/widget/separator.tsx";
import {TfiDownload, TfiUpload} from "react-icons/tfi";
import {talkDB} from "../../../state/db.ts";
import {useNavigate} from "react-router-dom";
import {formatNow} from "../../../util/util.tsx";

export const OtherSetting: React.FC = () => {
    const {butterflyOnAttachedMessage, showRecorder, wallpaper} = useSnapshot(appState.pref)
    const fileInputRef = useRef(null);
    const navigate = useNavigate()

    const showButterfly = useCallback((enabled: boolean) => {
        appState.pref.butterflyOnAttachedMessage = enabled
    }, [])

    const setShowRecorder = useCallback((enabled: boolean) => {
        appState.pref.showRecorder = enabled
    }, [])

    const setWallpaperIndex = useCallback((value?: number) => {
        appState.pref.wallpaper.index = value ?? 0
    }, [])

    const setWallpaperPreviewIndex = useCallback((value?: number) => {
        appState.pref.wallpaper.previewIndex = value
    }, [])

    const download = useCallback(() => {
        const db: Record<string, unknown> = {}
        talkDB.iterate((v, k) => {
            db[k] = v
            console.log(v)
            console.log(k)
        }).then(() => {
            const json = JSON.stringify(db, null, 2)
            console.debug("characters of json:", json.length)
            console.debug("json:", json)
            const blob = new Blob([json], {type: 'application/json'});
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = `talk-backup-${formatNow()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }, [])

    const restore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const json = e.target?.result as string;
                    const jsonObject = JSON.parse(json);
                    console.debug("json:", jsonObject);

                    const keys = Object.keys(jsonObject)

                    for (const key of keys) {
                        await talkDB.setItem(key, jsonObject[key])
                    }

                    navigate(0)
                } catch (error) {
                    // Handle JSON parsing error
                    console.error('Error parsing JSON file: ', error);
                }
            };
            reader.readAsText(file);
        }
    };

    return <div
        className="relative flex h-full select-none flex-col w-full before:bg-white before:bg-opacity-40
         pt-1 pb-3 px-3 gap-1 before:backdrop-hack before:backdrop-blur before:rounded-xl">

        <div className="flex justify-between items-center w-full px-3 ">
            <p className="prose text-lg text-neutral-600">Other</p>
        </div>
        <div
            className="flex flex-col justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed
            rounded-lg px-3 w-full">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-1">
                    <PiButterflyThin className="w-5 h-5 select-none -rotate-45 fill-neutral-600 stroke-2"/>
                    <p className="prose text text-neutral-600">
                        on Attached Messages
                    </p>
                </div>
                <MySwitch enabled={butterflyOnAttachedMessage} setEnabled={showButterfly}/>
            </div>
            <Separator/>
            <div className="flex justify-between items-center w-full ">
                <div className="flex items-center gap-1">
                    <p className="prose text text-neutral-600">
                        Show Recorder
                    </p>
                </div>
                <MySwitch enabled={showRecorder} setEnabled={setShowRecorder}/>
            </div>
            <Separator/>
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
            <Separator/>
            <div className="flex flex-wrap pt-2 pb-2 w-full gap-2">
                <CountDownButton text={"Backup"}
                                 countDownMs={0}
                                 color="blue"
                                 action={download}
                                 icon={<TfiDownload className="scale-y-90 stroke-[0.3px]"/>}
                />
                <input ref={fileInputRef} type="file" accept=".json"
                       onChange={restore}
                       className="hidden">
                </input>
                <CountDownButton text={"Restore[beta]"}
                                 countDownMs={0}
                                 color="blue"
                                 action={() => {
                                     if (fileInputRef.current) {
                                         (fileInputRef.current as HTMLInputElement).click()
                                     }
                                 }}
                                 icon={<TfiUpload className="scale-y-[0.8] stroke-[0.3px]"/>}
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