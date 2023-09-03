import {openDB} from "idb";

const dbName = 'audio';
const storeName = 'blobs';

export interface BlobEntry {
    id: string;
    blob: Blob;
}

async function newDB() {
    return await openDB(dbName, 1, {
        upgrade(db) {
            db.createObjectStore(storeName, {keyPath: 'id'});
        },
    });
}

export async function getBlob(id: string): Promise<BlobEntry | undefined> {
    const db = await newDB();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return await store.get(id);
}

export async function addBlob(blogEntry: BlobEntry) {
    const db = await newDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.add(blogEntry);
    await tx.done;
}

export async function clearBlob() {
    const db = await newDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear()
    await tx.done;
}

