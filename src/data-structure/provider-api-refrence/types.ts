export const k = 1024

export interface IntRange {
    readonly rangeStart: number;
    readonly rangeEnd: number;
    readonly default: number;
}

export interface FloatRange {
    readonly rangeStart: number;
    readonly rangeEnd: number;
    readonly default: number;
}

export interface ChooseOne<T extends number | string> {
    readonly choices: Choice<T>[];
    readonly default: Choice<T>;
}

export interface Choice<T extends number | string> {
    readonly name: string;
    readonly value: T;
    readonly tags: string[];
}

export const emptyStringChoice: Choice<string> = {
    name: "",
    value: "",
    tags: []
}