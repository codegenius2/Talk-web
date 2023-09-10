import {proxy} from 'valtio'
import {randomHash32Char} from "../util/util.tsx";


export const networkState = proxy({
    streamId: randomHash32Char()
})