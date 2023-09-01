import {create} from 'zustand';
import {randomHash} from "../util/util.tsx"
import {streamIdLength} from "../config.ts";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../store/zustant-db.tsx"


interface SSE {
    streamId: string
}

export const useSSEStore = create<SSE>()(
    devtools(
        persist(() => ({
                streamId: randomHash(streamIdLength),
            })
            , {
                name: 'sse',
                storage: createJSONStorage<string>(() => zustandStorage), // (optional) by default the 'localStorage' is used
            }
        )
    )
);
