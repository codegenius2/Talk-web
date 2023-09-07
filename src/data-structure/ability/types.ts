export interface IntRange {
    rangeStart: number;
    rangeEnd: number;
    default: number;
    chosen?: number;
}

export interface FloatRange {
    rangeStart: number;
    rangeEnd: number;
    default: number;
    chosen?: number;
}

export interface ChooseOne<T extends number | string> {
    choices: Choice<T>[];
    chosen?: T;
}

export const getOrDefault = <T extends string | number>(c: ChooseOne<T>, dft: T): T => {
    return c.chosen ?? c.choices?.[0].value ?? dft
}

export const mergeChoice = <T extends string | number>(c: ChooseOne<T>, pool: T[]): T|undefined => {
    if (c.chosen !== undefined && pool.includes(c.chosen)) {
        return c.chosen
    }
    return pool?.[0]
}

export interface Choice<T extends number | string> {
    name: string;
    value: T;
    tags: string[];
}