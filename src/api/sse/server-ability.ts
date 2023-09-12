// ServerAbility guide clients in adjusting all parameters.
export type ServerAbility = {
    llm: ServerLLM
    tts: ServerTTS
    stt: ServerSTT
}

// TTS
export type ServerTTS = {
    available: boolean
    google: ServerGoogleTTS
    elevenlabs: ServerElevenlabs
}

export type ServerGoogleTTS = {
    available: boolean
    voices?: Voice[]
}

export type ServerElevenlabs = {
    available: boolean
    voices?: Voice[]
}

// STT
export type ServerSTT = {
    available: boolean
    whisper: ServerWhisper
    google: ServerGoogleSTT
}

export type ServerWhisper = {
    available: boolean
    models?: string[]
}

export type ServerGoogleSTT = {
    available: boolean
}

// LLM
export type ServerLLM = {
    available: boolean
    chatGPT: ServerChatGPT
}

export type ServerChatGPT = {
    available: boolean
    models?: string[]
}

// other
export type Voice = {
    id: string
    name: string
    tags?: string [] // gender, accent, age, etc
}

export const defaultServerAbility = (): ServerAbility => {
    return {
        llm: {
            available: false,
            chatGPT: {
                available: false,
            }
        },
        tts: {
            available: false,
            google: {
                available: false
            },
            elevenlabs: {
                available: false
            }
        },
        stt: {
            available: false,
            whisper: {
                available: false
            },
            google: {
                available: false
            }
        },
    }
}
