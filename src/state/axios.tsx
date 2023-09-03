import {create} from 'zustand';
import {defaultRestfulAPI, RestfulAPI} from "../api/restful.ts";

type Store = {
    restfulAPI: RestfulAPI
    setRestfulAPI: (api: RestfulAPI) => void
}

export const useRestfulAPIStore = create<Store>((set) => (
        {
            restfulAPI: defaultRestfulAPI(),
            setRestfulAPI: (api: RestfulAPI) => set(() => ({restfulAPI: api}))
        }
    )
)