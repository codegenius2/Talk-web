import {create} from 'zustand';
import {EnhancedRecorder} from "../util/enhanced-recorder.ts"
import {chooseAudioMimeType, RecordingMimeType} from "../util/util.tsx"
import {RecordingCtx} from "../other.ts";

interface Recorder {
    recordingMimeType?: RecordingMimeType
    recorder: EnhancedRecorder<RecordingCtx>
}

export const useRecorderStore = create<Recorder>(
    () => (
        {
            recordingMimeType: chooseAudioMimeType(),
            // todo fix stop mic bug and set this to true
            recorder: new EnhancedRecorder(false),
        }
    )
)