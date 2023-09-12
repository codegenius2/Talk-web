import {ChooseOne} from "./types.ts";

export type WhisperAPIReference = {
    models: ChooseOne<string>
}

// see https://platform.openai.com/docs/api-reference/audio/createTranscription
export const whisperAPIReference = (): WhisperAPIReference => {
    return {
        models: {
            choices: [{name: "whisper-1", value: "whisper-1", tags: []}],
            default: {name: "whisper-1", value: "whisper-1", tags: []}
        }
    }
}