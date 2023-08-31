// TTS
export type TTS = {
    available: boolean
    google: GoogleTTS
    elevenlabs: ElevenlabsTTS
}

export type GoogleTTS = {
    available: boolean
    languages: Language[]
}

export type ElevenlabsTTS = {
    available: boolean
    languages: Language[]
}

// STT

export type STT = {
    available: boolean
    whisper: WhisperSTT
    google: GoogleSTT
}

export type WhisperSTT = {
    available: boolean
}

export type GoogleSTT = {
    available: boolean
}

// LLM
export type LLM = {
    available: boolean
    chatGPT: ChatGPTLLM
}

export type ChatGPTLLM = {
    available: boolean
    models: string[]
}

// other

export type Language = {
    name: string   // to display on UI
    code: string   // used by TTS/STT client
    tags: string [] // gender, accent, age, etc
}

