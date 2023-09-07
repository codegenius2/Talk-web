import {ServerGoogleTTS} from "../../api/sse/server-ability.ts";
import {ChooseOne, FloatRange, getOrDefault, mergeChoice} from "./types.ts";
import {GoogleTTSGender, GoogleTTSOption} from "../../api/option.ts";

export type ClientGoogleTTS = {
    enabled: boolean // represents user's choice to disable ChatGPT, irrespective of its availability - preventing use of TTS.
    available: boolean // indicates if server provides support for ChatGPT
    voice: ChooseOne<string>
    language: ChooseOne<string>
    gender: ChooseOne<number>
    speakingRate: FloatRange
    pitch: FloatRange
    volumeGainDb: FloatRange
}

export function mergeGoogleTTS(c: ClientGoogleTTS, s: ServerGoogleTTS): ClientGoogleTTS {
    return {
        ...c,
        available: s.available,
        voice: {
            choices: s.voices.map((v) => ({name: v.name, value: v.id, tags: v.tags})),
            chosen: mergeChoice(c.voice, s.voices.map(it => it.id))
        }
    }
}

export const toGoogleTTSOption = (google: ClientGoogleTTS): GoogleTTSOption | undefined => {
    if (!google.enabled || !google.available) {
        return undefined
    }
    return {
        voiceId: getOrDefault(google.voice, ""),
        languageCode: getOrDefault(google.language, ""),
        gender: getOrDefault(google.gender, GoogleTTSGender.neutral),
        speakingRate: google.speakingRate.chosen ?? google.speakingRate.default,
        pitch: google.pitch.chosen ?? google.pitch.default,
        volumeGainDb: google.volumeGainDb.chosen ?? google.volumeGainDb.default,
    }
}

// see https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig
export const defaultClientGoogleTTS = (): ClientGoogleTTS => {
    return {
        enabled: true,
        available: false,
        voice: {
            choices: [],
        },
        language: {
            choices: [],
        },
        gender: {
            choices: [
                {
                    name: "unspecified",
                    value: GoogleTTSGender.unspecified,
                    tags: []
                },
                {
                    name: "male",
                    value: GoogleTTSGender.male,
                    tags: []
                },
                {
                    name: "female",
                    value: GoogleTTSGender.female,
                    tags: []
                },
                {
                    name: "neutral",
                    value: GoogleTTSGender.neutral,
                    tags: []
                },
            ],
        },
        speakingRate: {
            rangeStart: 0.25,
            rangeEnd: 4,
            default: 1,
        },
        pitch: {
            rangeStart: -20,
            rangeEnd: 20,
            default: 0,
        },
        volumeGainDb: {
            rangeStart: -96.0,
            rangeEnd: 16.0,
            default: 0.0,
        },
    }
}