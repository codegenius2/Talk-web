import RecordPlugin from "wavesurfer.js/plugins/record";
import {RecordingMimeType} from "./Util.tsx";

export type RecordingStatus = 'init-idle' | 'recording' | 'done' | 'canceled'

// wrap RecordPlugin to proved onCancel function
export class MyRecorder {
    private r: RecordPlugin
    private recodingStatus: RecordingStatus
    private onStartF?: () => void
    private onDoneF?: (blob: Blob) => void
    private onCancelF?: (blob: Blob) => void

    constructor(recordingMimeType?: RecordingMimeType) {
        this.r = RecordPlugin.create({
            mimeType: recordingMimeType?.mimeType,
            audioBitsPerSecond: 100000
        })
        this.recodingStatus = 'init-idle'
        this.onStartF = () => {
        }
        this.onDoneF = (_blob: Blob) => {
        }
        this.onCancelF = (_blob: Blob) => {
        }
        this.r.on('record-start', () => {
            switch (this.recodingStatus) {
                case "recording":
                    this.onStartF?.()
                    break
                case "init-idle":
                case "done":
                case "canceled":
                    throw new Error("recorder has not started")
            }
        })
        this.r.on('record-end', (blob: Blob) => {
            switch (this.recodingStatus) {
                case "recording":
                    throw new Error("recorder has not stopped")
                case "init-idle":
                    throw new Error("recorder is at illegal state")
                case "done":
                    this.onDoneF?.(blob)
                    break
                case "canceled":
                    this.onCancelF?.(blob)
                    break
            }
        })
    }

    onStart(f: () => void): void {
        this.onStartF = f
    }

    onDone(f: (blob: Blob) => void): void {
        this.onDoneF = f
    }

    onCancel(f: (blob: Blob) => void): void {
        this.onCancelF = f
    }

    start(): Promise<void> {
        this.recodingStatus = 'recording'
        return this.r.startRecording()
    }

    done(): void {
        this.recodingStatus = 'done'
        this.r.stopRecording()
    }

    cancel(): void {
        this.recodingStatus = 'canceled'
        this.r.stopRecording()
    }

    toggleRecord(c: (e: unknown) => void): void {
        if (this.r.isRecording()) {
            this.done()
        } else {
            this.start().catch(c)
        }
    }
}

