import localforage from "localforage"

const talkDbName = "talk"
export const appStateKey = "app-state"
export const promptStateKey = "prompt-state"

localforage.config({
    version: 1.0,
})

export const talkDB = localforage.createInstance({
    name: talkDbName
})

const audioDB = "audio"

export const audioDb = localforage.createInstance({
    name: audioDB
})

export const deleteBlobs = async (ids: string[]) => {
    for (const id of ids) {
        await audioDb.removeItem(id)
    }
}