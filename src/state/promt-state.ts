import {proxy, snapshot, subscribe} from 'valtio'
import {promptStateKey, talkDB} from "./db.ts"
import {presetPrompts} from "../data/prompt.ts";
import {randomHash16Char} from "../util/util.tsx";
import {LLMMessage} from "../shared-types.ts";
import {appState, hydrationState} from "./app-state.ts";
import {subscribeKey} from "valtio/utils";
import _ from "lodash";

export type Prompt = {
    id: string,
    name: string
    messages: LLMMessage[]
    preset: boolean
}

export type  PromptState = {
    prompts: Prompt[]
}

export const promptState = proxy<PromptState>({
    prompts: presetPrompts()
})

export const defaultPromptState = (): PromptState => ({
    prompts: presetPrompts()
})

talkDB.getItem<PromptState>(promptStateKey).then((ps: PromptState | null) => {
    console.debug("restoring promptState from db:", ps)

    if (ps !== null) {
        const dft = defaultPromptState()
        Object.keys(promptState).forEach((key) => {
            console.debug("restoring from db, key:", key)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            promptState[key as keyof PromptState] = ps[key] ?? dft[key]
        })
    }
    console.debug("restored")
})

subscribe(promptState, () => {
    const ps = snapshot(promptState)
    talkDB.setItem(promptStateKey, ps).then(() => {
        console.debug("promptState saved")
    })
})

export const findPrompt = (id: string): Prompt | undefined => {
    if (id === "") {
        return undefined
    }
    return promptState.prompts.find(it => it.id === id)
}

export const newPrompt = (): string => {
    const newP: Prompt = {
        id: randomHash16Char(),
        name: "New Prompt",
        messages: [{role: "user", content: ""}],
        preset: false
    }
    promptState.prompts.unshift(newP)
    return newP.id
}

export const clonePrompt = (p: Prompt): string => {
    const newP: Prompt = {
        id: randomHash16Char(),
        name: p.name,
        messages: p.messages.map(m => ({...m})),
        preset: false
    }
    promptState.prompts.unshift(newP)
    return newP.id
}

export const deletePrompt = (id: string): void => {
    console.debug("deletePrompt", id)
    for (let i = 0; i < promptState.prompts.length; i++) {
        if (promptState.prompts[i].id === id) {
            promptState.prompts.splice(i, 1)
            return
        }
    }
}

export type  PromptCountState = {
    counts: Record<string, number>
}

export const promptCountState = proxy<PromptCountState>({
    counts: {}
})

export const syncPromptIdCounts = () => {
    // console.log("syncPromptIdCounts")
    for (const key in promptCountState.counts) {
        delete promptCountState.counts[key]
    }
    const group = _.groupBy(appState.chats, c => c.promptId)
    for (const key in group) {
        promptCountState.counts[key] = group[key].length
    }
}

subscribeKey(appState.chats, "length", () => {
    syncPromptIdCounts()
})

subscribe(hydrationState, () => {
    syncPromptIdCounts()
})

syncPromptIdCounts()