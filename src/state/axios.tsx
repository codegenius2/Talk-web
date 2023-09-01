import {create} from 'zustand';
import {randomHash} from "../util/util.tsx";
import {streamIdLength} from "../config.ts";

export const useAxiosStore = create(() => (
        {
            instance: randomHash(streamIdLength)
        }
    )
)