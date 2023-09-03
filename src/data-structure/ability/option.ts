/**
 * When make a request to the Talk server, append a TalkOption to the request.
 * Each LLMOption, TTSOption, and SSTOption within TalkOption can only engage one provider at a time.
 * For instance, either `talkOption.llm.chatGPT` or `talkOption.llm.claude` should be set to `undefined`.
 */
export type TalkOption = {
    llm?: LLMOption
}

export type LLMOption = {
    chatGPT?: ChatGPTOption
}

export type ChatGPTOption = {
    model: string
    maxTokens: number
    temperature: number
    presencePenalty: number
    frequencyPenalty: number
}