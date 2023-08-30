export interface Message {
    role: string;
    content: string;
}

export interface ConversationReq {
    id: string; // unique ID for every conversation
    ms: Message[];
}

export interface Tunability {
    model: SingleChoice<string>;
    maxTokens: IntRange;
    temperature: FloatRange;
    presencePenalty: FloatRange;
    frequencyPenalty: FloatRange;
}

export interface TuneOption {
    model: string;
    maxTokens?: number;
    temperature?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
}

export interface Boolean {
    tunable: boolean;
    default: boolean;
}

export interface IntRange {
    tunable: boolean;
    rangeStart: number;
    rangeEnd: number;
    default: number;
}

export interface FloatRange {
    tunable: boolean;
    rangeStart: number;
    rangeEnd: number;
    default: number;
}

export interface SingleChoice<T> {
    tunable: boolean;
    choices: Choice<T>[];
    default: T;
}

export interface MultiChoice<T> {
    tunable: boolean;
    choices: Choice<T>[];
    default: Choice<T>[];
}

export interface Choice<T> {
    name: string;
    value: T;
    tags: string[];
}

