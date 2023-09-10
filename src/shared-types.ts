export type Role = 'user' | 'assistant' | 'system'

export type LLMMessage = {
    role: Role;
    content: string;
}