import {ClientLLM, defaultClientLLM, mergeLLM, toLLMOption} from "./llm.ts";
import {ClientTTS, defaultClientTTS, mergeTTS, toTTSOption} from "./tts.ts";
import {ClientSTT, defaultClientSTT, mergeSTT, toSTTOption} from "./stt.ts";
import {ServerAbility} from "../../../api/sse/server-ability.ts";
import {TalkOption} from "../../../api/restful/model.ts";

/**
 * Data structures embodying the parameters intended for the settings page display.
 * Despite the Talk server's capacity to support a multitude of providers, each LLM, TTS, and SST within Ability
 * can only engage one provider at a time.
 */
export type ClientAbility = {
    llm: ClientLLM
    tts: ClientTTS
    stt: ClientSTT
}

// server tells client what models, languages and other parameters it supports
export const mergeAbility = (c: ClientAbility, s: ServerAbility): ClientAbility => {
    return {
        llm: mergeLLM(c.llm, s.llm),
        tts: mergeTTS(c.tts, s.tts),
        stt: mergeSTT(c.stt, s.stt)
    }
}

export const toTalkOption = (ability: ClientAbility): TalkOption => {
    return {
        toText: true,
        toSpeech: false,// not for now
        completion: true,
        completionToSpeech: true,
        llmOption: toLLMOption(ability.llm),
        ttsOption: toTTSOption(ability.tts),
        sttOption: toSTTOption(ability.stt),
    }
}


export const defaultAbility = (): ClientAbility => ({
    llm: defaultClientLLM(),
    tts: defaultClientTTS(),
    stt: defaultClientSTT(),
})

