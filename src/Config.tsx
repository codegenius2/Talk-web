import {currentSocketProtocolHostPort} from "./Util.tsx";

export function socketEndpoint():string{
    return currentSocketProtocolHostPort()+"/ws"
}