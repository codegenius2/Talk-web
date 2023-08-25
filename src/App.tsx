import './App.css'
import {useEffect, useRef, useState} from "react";
import Recorder from "./Recorder.tsx";
import {useRecorderStore} from "./state/Recording.tsx";
import {MyRecorder} from "./MyRecorder.tsx";
import MessageList from "./component/MessageList.tsx";
import TextArea from "./component/TextArea.tsx";
import Websocket from "./websocket/Websocket.tsx";
import {Subscribers} from "./subscriber/Subscribers.tsx";

export default function App() {
    const isRecording = useRecorderStore((state) => state.isRecording)
    const recorder = useRecorderStore<MyRecorder>((state) => state.recorder)
    const incrRecordDuration = useRecorderStore((state) => state.incrDuration)
    const setRecordDuration = useRecorderStore((state) => state.setDuration)
    const [spacePressed, setSpacePressed] = useState<boolean>(false)
    const spacePressedRef = useRef(spacePressed);

    useEffect(() => {
        if (isRecording) {
            setRecordDuration(0)
        }
        const interval = setInterval(() => {
            incrRecordDuration(50)
        }, 50);

        return () => {
            clearInterval(interval)
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

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    return (
        <div className="flex flex-col items-center justify-between h-screen gap-1 p-1 overflow-hidden" id="container">
            <MessageList/>
            <div className="flex flex-col items-center w-full mt-auto bottom-0 max-w-2xl backdrop-blur bg-opacity-75">
                <TextArea/>
                <div className="flex justify-center items-center w-full mt-1">
                    <Recorder/>
                </div>
            </div>
            <Websocket/>
            <Subscribers/>
        </div>
    )
}
