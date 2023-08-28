// do not change these types by modifying fields, using the defined functions instead

export type AudioStatus = 'sending' | 'sent' | 'receiving' | 'received' | 'error'

export type Audio = {
    status: AudioStatus
    errorMessage?: string
    audioId?: string
}

export const newAudio = (status: AudioStatus, audioId?: string): Audio => {
    return {
        status: status,
        audioId: audioId
    }
}

export const sent = (prev: Audio): Audio => {
    switch (prev.status) {
        case "sending":
            return {
                ...prev,
                status: 'sent'
            }
        case "sent":
        case "receiving":
        case "received":
        case "error":
            return {...prev}
    }
}

export const newAudioId = (prev: Audio, audioId: string): Audio => {
    switch (prev.status) {
        case "sending":
        case "sent":
            return {
                ...prev,
                audioId: audioId,
                // do not update status because audio may have not been sent to server
            }
        case "receiving":
            return {
                ...prev,
                audioId: audioId,
                status: 'received'
            }
        case "received":
            console.error("invalid state:" + prev.status)
            return {...prev,}
        case "error":
            console.error("invalid state:" + prev.status)
            return {...prev,}
    }
}

export const error = (prev: Audio, errMsg: string): Audio => {
    switch (prev.status) {
        case "sending":
        case "receiving":
            return {
                ...prev,
                errorMessage: errMsg,
                status: 'error'
            }
        case "sent":
        case "received":
            console.error("invalid state:" + prev.status)
            return {...prev,}
        case "error":
            console.error("invalid state:" + prev.status)
            return {...prev,}
    }
}


