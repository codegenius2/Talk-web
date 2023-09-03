import {create} from 'zustand';
import {randomHash} from "../util/util.tsx"
import {streamIdLength} from "../config.ts";


interface SSE {
    streamId: string
}

export const useSSEStore = create<SSE>()(
    (() => ({
            streamId: randomHash(streamIdLength),
        })
    )
);
