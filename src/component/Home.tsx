import {useEffect, useRef, useState} from "react";
import Recorder from "../component/Recorder.tsx";
import {useRecorderStore} from "../state/Recording.tsx";
import {MessageList} from "./MessageList.tsx";
import TextArea from "../component/TextArea.tsx";
import {Workers} from "../worker/Workers.tsx";
import {SSE} from "../SSE.tsx";
import {MyRecorder} from "../util/MyRecorder.ts";
import {useMouseStore} from "../state/Mouse.tsx";
import HomeWallpaper from "./wallpaper/HomeWallpaper.tsx";
import Setting from "./setting/setting.tsx";

export default function Home() {
    const isRecording = useRecorderStore((state) => state.isRecording)
    const recorder = useRecorderStore<MyRecorder>((state) => state.recorder)
    const incrRecordDuration = useRecorderStore((state) => state.incrDuration)
    const setRecordDuration = useRecorderStore((state) => state.setDuration)
    const [spacePressed, setSpacePressed] = useState<boolean>(false)
    const spacePressedRef = useRef(spacePressed);
    const setMouseDown = useMouseStore(state => state.setMouseDown)
    useEffect(() => {
        if (isRecording) {
            setRecordDuration(0)
        }
        const interval = setInterval(() => {
            incrRecordDuration(50)
        }, 50);

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        };
    }, [isRecording]);

    useEffect(() => {
        spacePressedRef.current = spacePressed;
    }, [spacePressed]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            console.debug('handleKeyDown', event.code);
            if (event.code === 'Space') {
                if (event.repeat) {
                    console.debug('handleKeyDown skip repeated space');
                    return
                }
                setSpacePressed(true)
                recorder.start().catch((e) => {
                    console.error("failed to start recorder", e)
                })
            } else {
                if (spacePressedRef.current) {
                    recorder.cancel()
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            console.debug('handleKeyUp', event.code);
            if (event.code == 'Space') {
                setSpacePressed(false)
                recorder.done()
            }
        };

        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", () => setMouseDown(true));
        window.addEventListener("mouseup", () => setMouseDown(false));

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    return (
        <div>
            <HomeWallpaper/>
            <div
                // style={wpStyleSkyPink}
                className="home flex items-center justify-center h-screen w-screen overflow-hidden gap-2 lg:p-3">
                <div
                    className="flex flex-col items-center max-w-4xl w-full h-full rounded-lg justify-between gap-1 p-2 bg-white bg-opacity-60">
                    <MessageList/>
                    <div
                        className="flex flex-col rounded-lg items-center gap-2 w-full px-2 mt-auto bottom-0">
                        <TextArea/>
                        <div className="flex justify-center items-center w-full mt-1">
                            <Recorder/>
                        </div>
                    </div>
                </div>
                <div className="h-full w-full max-w-1/4 hidden sm:block">
                    <Setting/>
                </div>
            </div>
            <SSE/>
            <Workers/>
        </div>
    )
}
