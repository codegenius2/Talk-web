import {ChooseOne, FloatRange} from "./types.ts";
import {GoogleTTSGender} from "../../api/restful/model.ts";
import {googleTTSLanguageStrings} from "../../data/google-tts-language.ts";

export type GoogleTTSAPIReference = {
    language: ChooseOne<string>
    gender: ChooseOne<number>
    speakingRate: FloatRange
    pitch: FloatRange
    volumeGainDb: FloatRange
}

// see https://cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioConfig
export const googleTTSAPIReference: GoogleTTSAPIReference = {
    language: {
        choices: googleTTSLanguageStrings,
        default: {
            value: "en-GB",
            name: "English (Great Britain)",
            tags: []
        },
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
        default: {
            name: "unspecified",
            value: GoogleTTSGender.unspecified,
            tags: []
        },
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