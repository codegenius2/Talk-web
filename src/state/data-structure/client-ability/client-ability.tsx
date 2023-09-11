import {ClientLLM, defaultClientLLM, adjustLLM, toLLMOption} from "./llm.ts";
import {ClientTTS, defaultClientTTS, adjustTTS, toTTSOption} from "./tts.ts";
import {ClientSTT, defaultClientSTT, applySTT, toSTTOption} from "./stt.ts";
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
export const adjustAbility = (c: ClientAbility, s: ServerAbility): void => {
    adjustLLM(c.llm, s.llm)
    adjustTTS(c.tts, s.tts)
    applySTT(c.stt, s.stt)
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

