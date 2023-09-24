import {ChooseOne} from "./types.ts"
import {googleTTSLanguageStrings} from "../../data/google-tts-language.ts"

export type GoogleSTTAPIReference = {
    language: ChooseOne<string>
    models: ChooseOne<string>
}

// see https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig
export const googleSTTAPIReference: GoogleSTTAPIReference = {
    language: {
        choices: googleTTSLanguageStrings,
        default: {
            value: "en-GB",
            name: "English (Great Britain)",
            tags: []
        },
    },
    models: {
        choices: [
            {
                name: "short",
                value: "short",
                tags: []
            },
            {
                name: "long",
                value: "long",
                tags: []
            },
            {
                name: "chirp",
                value: "chirp",
                tags: []
            },
            {
                name: "telephony",
                value: "telephony",
                tags: []
            },
            {
                name: "medical_dictation",
                value: "medical_dictation",
                tags: []
            },
            {
                name: "medical_conversation",
                value: "medical_conversation",
                tags: []
            },
        ],
        default: {
            name: "short",
            value: "short",
            tags: []
        },
    }
}
