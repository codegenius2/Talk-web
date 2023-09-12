export type Role = 'user' | 'assistant' | 'system'

export type LLMMessage = {
    role: Role;
    content: string;
}

export type Switchable = {
    // there is a distinction between 'enabled' and 'available'.
    enabled: boolean // represents user's choice to disable ChatGPT, irrespective of its availability - preventing use of LLM.
    available: boolean // indicates if server provides support for ChatGPT
}