import {useEffect, useRef, useState} from "react";
import {useRecorderStore} from "../state/recording.tsx";
import TextArea from "./taxt-area.tsx";
import {Workers} from "../worker/workers.tsx"
import {MyRecorder} from "../util/my-recorder.ts"
import {useMouseStore} from "../state/mouse.tsx";
import Setting from "./setting/setting.tsx";
import {WallpaperDefault, WallpaperSimultaneousCounter} from "./wallpaper/wallpaper.tsx";
import ErrorBoundary from "./error-boundary.tsx";
import {MessageList} from "./message-list.tsx";
import Recorder from "./recorder.tsx";
import {SSE} from "../sse.tsx";

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
            <WallpaperSimultaneousCounter/>
            <div
                className="home flex items-center justify-center h-screen w-screen overflow-hidden gap-2 lg:p-3">
                <div
                    className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-white bg-opacity-40 backdrop-blur">
                    <MessageList/>
                    <div
                        className="flex flex-col rounded-xl items-center gap-2 w-full px-2 mt-auto bottom-0">
                        <TextArea/>
                        <div className="flex justify-center items-center w-full my-1">
                            <Recorder/>
                        </div>
                    </div>
                </div>
                <div className="h-full w-full max-w-1/4  hidden sm:block">
                    <Setting/>
                </div>
            </div>
            <ErrorBoundary>
                <SSE/>
                <Workers/>
            </ErrorBoundary>
        </div>
    )
}
