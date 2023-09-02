import RecordPlugin from "wavesurfer.js/plugins/record";
import {RecordingMimeType} from "./util.tsx";

type RecordingStatus = 'init-idle' | 'recording' | 'done' | 'canceled'

/**
 * Wraps RecordPlugin to proved addCancelListener and the state of recoding
 */
export class EnhancedRecorder<CTX> {
    private r: RecordPlugin
    /**
     *  Considerations for ceasing microphone use post-recording
     *
     * In the majority of browsers, a red microphone symbol is displayed as recording commences.
     * Typically, this symbol remains red even after the RecordPlugin has ceased recording.
     * This standard browser behaviour can mislead users into believing that our website continues to access their microphone,
     * potentially causing undue worry.
     * To eliminate the red microphone symbol in browsers, invoke this.r.stopMic().
     *
     * Potential drawbacks of invoking stopMic():
     * 1. Certain browsers may prompt for microphone permission each time a recording begins.
     * 2. Initiating a new recording may be subject to a delay.
     **/
    private readonly stopMicToo: boolean // todo cannot start RecordPlugin after calling stopMic once, RecordPlugin should be replaced
    /**
     * Callers should not access recodingStatus field. Callers can only be notified about recodingStatus in callbacks.
     * The reason is that recodingStatus does not reflect the real state RecordPlugin
     */
    private recodingStatus: RecordingStatus
    private startedAt?: Date
    /**
     * A context whose life cycle is just between the beginning and ending of a recording
     * Callers have full control to this context in its life cycle
     */
    private context?: CTX
    private startListeners: ((ctx?: CTX) => void)[]
    private doneListeners: ((blob: Blob, duration: number, ctx?: CTX) => void)[]
    private cancelListeners: ((blob: Blob, duration: number, ctx?: CTX) => void)[]

    constructor(stopMicToo: boolean, recordingMimeType?: RecordingMimeType) {
        this.recodingStatus = 'init-idle'
        this.stopMicToo = stopMicToo
        this.startListeners = []
        this.doneListeners = []
        this.cancelListeners = []
        this.r = RecordPlugin.create({
            mimeType: recordingMimeType?.mimeType,
            audioBitsPerSecond: 100000
        })
        this.r.on('record-start', () => {
            switch (this.recodingStatus) {
                case "recording":
                    this.startedAt = new Date()
                    // todo must catch errors
                    this.startListeners?.forEach(f => f(this.context))
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
                    this.doneListeners.forEach(f => f(blob, this.currentRecordingDuration(), this.context))
                    this.cleanUp()
                    break
                case "canceled":
                    this.cancelListeners.forEach(f => f(blob, this.currentRecordingDuration(), this.context))
                    this.cleanUp()
                    break
            }
        })
    }

    private cleanUp(): void {
        // reset startedAt after handling all callbacks to ensure currentRecordingDuration() get correct duration
        this.startedAt = undefined
        this.context = undefined
        if (this.stopMicToo) {
            this.r.stopMic()
        }
    }

    currentRecordingDuration(): number {
        if (this.startedAt) {
            return (new Date()).getTime() - this.startedAt.getTime()
        } else {
            return 0
        }
    }

    // todo delete me if not referred
    currentContext(): CTX | undefined {
        return this.context
    }

    async start(context?: CTX): Promise<void> {
        if(this.stopMicToo){
            await this.r.startMic()
        }
        this.recodingStatus = 'recording'
        this.context = context // this should be done in  r.startRecording().then(() => {}), but RecordPlugin trigger other listeners first
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

    addStartListener(f: (ctx?: CTX) => void): void {
        this.startListeners.push(f)
    }

    addDoneListener(f: (blob: Blob, duration: number, ctx?: CTX) => void): void {
        this.doneListeners.push(f)
    }

    addCancelListener(f: (blob: Blob, duration: number, ctx?: CTX) => void): void {
        this.cancelListeners.push(f)
    }

    removeStartListener(f: (ctx?: CTX) => void): void {
        this.startListeners = this.startListeners.filter(l => l !== f)
    }

    removeDoneListener(f: (blob: Blob, duration: number, ctx?: CTX) => void): void {
        this.doneListeners = this.doneListeners.filter(l => l !== f)
    }

    removeCancelListener(f: (blob: Blob, duration: number, ctx?: CTX) => void): void {
        this.cancelListeners = this.cancelListeners.filter(l => l !== f)
    }
}
