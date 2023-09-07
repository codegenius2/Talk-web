import {create} from 'zustand';
import {randomHash} from "../util/util.tsx"


interface SSE {
    streamId: string
}

export const useSSEStore = create<SSE>()(
    (() => ({
            streamId: randomHash(),
        })
    )
);
