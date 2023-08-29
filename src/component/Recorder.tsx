import {useEffect} from 'react';
import {useRecorderStore} from "../state/Recording.tsx";
import {MyRecorder} from "../util/MyRecorder.ts";
import {useSendingAudioStore} from "../state/Input.tsx";


const Recorder = () => {
    const isRecording = useRecorderStore((state) => state.isRecording)
    const recorder = useRecorderStore<MyRecorder>((state) => state.recorder)
    const setIsRecording = useRecorderStore((state) => state.setIsRecording)

    useEffect(() => {
        recorder.onDone((blob: Blob) => {
            setIsRecording(false)
            useSendingAudioStore.setState({sendingAudio: blob})
            // stop mic on safari to remove the red mic icon
            // recorder.stopMic()
        });
        recorder.onStart(() => {
            setIsRecording(true)
        });
        recorder.onCancel(() => {
            setIsRecording(false)
        });
    }, []);

    const handleClick = () => {
        recorder.toggleRecord((e) => {
            console.error("failed to start recorder", e)
        })
    }

    const handleTouchStart = () => {
        console.log('handleTouchStart');
        recorder.start().catch(
            (e) => {
                console.error("failed to start recorder", e)
            }
        )
    };
    const handleTouchEnd = () => {
        console.log('handleTouchEnd');
        recorder.done()
    };
    const handleTouchCancel = () => {
        console.log('handleTouchCancel');
        recorder.cancel()
    };

    return <div onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                className="flex justify-center items-center rounded-lg p-1 gap-2 w-full h-10 shrink-0 bg-equal-100 select-none"
    >
        <div className={"flex gap-3 justify-center items-center " + (isRecording ? "hidden" : "")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6 text-neutral-900">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
            </svg>
            <div className="prose text-equal-500">
                Hold <kbd className="border rounded-md bg-white px-1.5 py-0.5">Spacebar</kbd> to speak
            </div>
        </div>
        <div hidden={!isRecording}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                 className="w-6 h-6 text-red-400">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z"/>
                <path
                    d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z"/>
            </svg>
        </div>
    </div>
}


export default Recorder;

