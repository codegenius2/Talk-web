// do not change these types by modifying fields, using the defined functions instead

type AudioState = {
    status: 'pending' | 'done' | 'error'
    errorMessage?: string
}

export type Audio = AudioState & { audioBlobKey?: string }

export const newAudio = (): Audio => {
    return {status: 'pending'}
}

export const onNewAudioBlobId = (a: Audio, audioBlobKey: string): Audio => {
    switch (a.status) {
        case "pending":
            if (!audioBlobKey) {
                throw new Error("empty audioBlobKey")
            }
            return {
                ...a,
                audioBlobKey: audioBlobKey,
                status: 'done'
            }
        case "done":
            throw new Error("invalid state")
        case "error":
            throw new Error("invalid state")
    }
}

export const onError = (a: Audio, errMsg: string): Audio => {
    switch (a.status) {
        case "pending":
            return {
                ...a,
                errorMessage: errMsg,
                status: 'error'
            }
        case "done":
            throw new Error("invalid state")
        case "error":
            throw new Error("invalid state")
    }
}