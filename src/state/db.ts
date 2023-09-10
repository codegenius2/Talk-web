import localforage from "localforage";

const talkDbName = "talk"
export const appStateKey = "app-state"

localforage.config({
    version: 1.0,
});

export const appDb = localforage.createInstance({
    name: talkDbName
});


const audioDB = "audio"

export const audioDb = localforage.createInstance({
    name: audioDB
})

export const deleteBlobs = (ids: string[], callBack: () => void): void => {
    for (const id of ids) {
        audioDb.removeItem(id, callBack)
    }
}