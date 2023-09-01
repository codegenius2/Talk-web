import {create} from 'zustand';
import {MyRecorder} from "../util/my-recorder.ts"
import {chooseAudioMimeType, RecordingMimeType} from "../util/util.tsx"

interface Recorder {
    isRecording: boolean
    duration: number, // in ms
    recordingMimeType?: RecordingMimeType
    recorder: MyRecorder
    setIsRecording: (isRecording: boolean) => void
    setDuration: (duration: number) => void
    incrDuration: (incr: number) => void
}

export const useRecorderStore = create<Recorder>(
    (set) => (
        {
            isRecording: false,
            duration: 0,
            recordingMimeType: chooseAudioMimeType(),
            recorder: new MyRecorder(chooseAudioMimeType()),
            setIsRecording: (isRecording: boolean) => set((state) => ({
                ...state,
                isRecording: isRecording
            })),
            setDuration: (duration: number) => set((state) => ({
                ...state,
                duration: duration
            })),
            incrDuration: (incr: number) => set((state) => ({
                ...state,
                duration: state.duration + incr
            })),
        }
    )
)