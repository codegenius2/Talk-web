import {create} from 'zustand';
import {EnhancedRecorder} from "../util/enhanced-recorder.ts"
import {chooseAudioMimeType} from "../util/util.tsx"
import {RecordingCtx} from "../other.ts";
import {popularMimeTypes, RecordingMimeType} from "../config.ts";

interface Recorder {
    recordingMimeType?: RecordingMimeType
    recorder: EnhancedRecorder<RecordingCtx>
}

export const useRecorderStore = create<Recorder>(
    () => (
        {
            recordingMimeType: chooseAudioMimeType(popularMimeTypes),
            // todo fix stop mic bug and set this to true
            recorder: new EnhancedRecorder(false),
        }
    )
)