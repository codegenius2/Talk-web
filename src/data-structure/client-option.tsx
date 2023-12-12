import * as api from "../api/restful/model.ts"
import {ServerAbility} from "../api/sse/server-ability.ts"
import {chatGPTAPIReference} from "./provider-api-refrence/chat-gpt.ts"
import {googleTTSAPIReference} from "./provider-api-refrence/google-tts.ts"
import {elevenlabsAPIReference} from "./provider-api-refrence/elevenlabs-tts.ts"
import {Switchable} from "../shared-types.ts"
import {llmAPIReference} from "./provider-api-refrence/llm.ts"
import {googleSTTAPIReference} from "./provider-api-refrence/google-stt.ts"

/**
 * Data structures embodying the parameters intended for the settings page display.
 * Despite the Talk server's capacity to support a multitude of providers, each LLM, TTS, and SST within Option
 * can only have one provider enabled at a time.
 */
export type ClientOption = {
    llm: LLMOption
    tts: TTSOption
    stt: STTOption
}

export const defaultOption = (): ClientOption => ({
    llm: {
        chatGPT: {
            available: false,
            enabled: true,
            maxTokens: chatGPTAPIReference.maxTokens.default,
            temperature: chatGPTAPIReference.temperature.default,
            topP: chatGPTAPIReference.topP.default,
            presencePenalty: chatGPTAPIReference.presencePenalty.default,
            frequencyPenalty: chatGPTAPIReference.frequencyPenalty.default,
        },
        claude: {
            available: false,
            enabled: true,
        },
        maxAttached: llmAPIReference.maxAttached.default,
    },
    tts: {
        google: {
            available: false,
            enabled: true,
            languageCode: googleTTSAPIReference.language.default.value,
            gender: googleTTSAPIReference.gender.default.value,
            speakingRate: googleTTSAPIReference.speakingRate.default,
            pitch: googleTTSAPIReference.pitch.default,
            volumeGainDb: googleTTSAPIReference.volumeGainDb.default,
        },
        elevenlabs: {
            available: false,
            enabled: true,
            stability: elevenlabsAPIReference.stability.default,
            clarity: elevenlabsAPIReference.clarity.default
        },
    },
    stt: {
        whisper: {
            available: false,
            enabled: true,
        },
        google: {
            available: false,
            enabled: true,
            language: googleSTTAPIReference.language.default.value,
            model: googleSTTAPIReference.models.default.value,
        },
    }
})

// server tells client what models, languages and other parameters it supports
export const adjustOption = (c: ClientOption, s: ServerAbility): void => {
    c.llm.chatGPT.available = s.llm.chatGPT.available
    c.llm.chatGPT.model = pickOne(c.llm.chatGPT.model, s.llm.chatGPT.models, m => m)

    c.tts.google.available = s.tts.google.available
    c.tts.elevenlabs.available = s.tts.elevenlabs.available
    c.tts.elevenlabs.voiceId = pickOne(c.tts.elevenlabs.voiceId, s.tts.elevenlabs.voices, voice => voice.id)

    c.stt.whisper.available = s.stt.whisper.available
    c.stt.whisper.model = pickOne(c.stt.whisper.model, s.stt.whisper.models, m => m)
    c.stt.google.available = s.stt.google.available
    c.stt.google.recognizer = pickOne(c.stt.google.recognizer, s.stt.google.recognizers, rec => rec.id)
}

type Adjust = {
    model?: string
}

export const toRestfulAPIOption = (c: ClientOption, adjust?: Adjust): api.TalkOption => {
    const opt: api.TalkOption = {
        toSpeech: false, // maybe support this in the future
        toText: false,
        completion: false,
        completionToSpeech: false,
    }

    // LLM
    const chatGPT = c.llm.chatGPT
    if (chatGPT.available && chatGPT.enabled) {
        opt.llmOption = {
            chatGPT: {
                ...chatGPT,
                model: adjust?.model ?? (chatGPT.model ?? "")
            }
        }
        opt.completion = true
    }

    // TTS, only one provider should be used at a time 
    const googleTTS = c.tts.google
    const elevenlabs = c.tts.elevenlabs
    if (googleTTS.available && googleTTS.enabled) {
        opt.ttsOption = {
            google: {
                ...googleTTS,
            }
        }
        opt.completionToSpeech = true
    } else if (elevenlabs.available && elevenlabs.enabled) {
        opt.ttsOption = {
            elevenlabs: {
                ...elevenlabs,
                voiceId: elevenlabs.voiceId ?? ""
            }
        }
        opt.completionToSpeech = true
    }

    // STT
    const whisper = c.stt.whisper
    const googleSTT = c.stt.google
    if (whisper.available && whisper.enabled) {
        opt.sttOption = {
            whisper: {
                ...whisper,
                model: whisper.model ?? ""
            }
        }
        opt.toText = true
    } else if (googleSTT.available && googleSTT.enabled) {
        opt.sttOption = {
            google: {
                ...googleSTT,
                model: googleSTT.model,
                language: googleSTT.language ?? "",
                recognizer: googleSTT.recognizer ?? ""
            }
        }
        opt.toText = true
    }
    return opt
}

export type LLMOption = {
    chatGPT: ChatGPTOption
    claude: ClaudeOption
    maxAttached: number
}

export type ChatGPTOption = Switchable & {
    model?: string // mustn't be empty if enabled === true
    maxTokens: number
    temperature: number
    topP: number
    presencePenalty: number
    frequencyPenalty: number
}

export type ClaudeOption = Switchable

export type STTOption = {
    whisper: WhisperOption
    google: GoogleOption
}

export type WhisperOption = Switchable & {
    model?: string
}

export type GoogleOption = Switchable & {
    recognizer?: string // mustn't be empty if enabled === true
    language?: string
    model?: string
}

export type TTSOption = {
    google: GoogleTTSOption
    elevenlabs: ElevenlabsTTSOption
}


export type GoogleTTSOption = Switchable & {
    // if VoiceId is provided, LanguageCode and Gender will not be used
    voiceId?: string // mustn't be empty if enabled === true
    languageCode: string
    gender?: api.GoogleTTSGender
    /**
     * An unspecified gender.
     * In VoiceSelectionParams, this means that the client doesn't care which
     * gender the selected voice will have. In the Voice field of
     * ListVoicesResponse, this may mean that the voice doesn't fit any of the
     * other categories in this enum, or that the gender of the voice isn't known.
     * SsmlVoiceGender_SSML_VOICE_GENDER_UNSPECIFIED SsmlVoiceGender = 0
     * A male voice.
     * SsmlVoiceGender_MALE SsmlVoiceGender = 1
     * A female voice.
     * SsmlVoiceGender_FEMALE SsmlVoiceGender = 2
     * A gender-neutral voice. This voice is not yet supported.
     * SsmlVoiceGender_NEUTRAL SsmlVoiceGender = 3
     */
    speakingRate: number
    pitch: number
    volumeGainDb: number
}

export type ElevenlabsTTSOption = Switchable & {
    voiceId?: string // mustn't be empty if enabled === true
    stability: number
    clarity: number
}

const pickOne = <V extends string | number, T>(current: V | undefined, pool: T[] | undefined, getValue: (t: T) => V): V | undefined => {
    if (pool && pool.length > 0) {
        const values = pool.map(getValue)
        if (current && values.includes(current)) {
            return current
        } else {
            return values[0]
        }
    }
    return undefined
}