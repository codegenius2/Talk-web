import TextArea from "./text-area.tsx";
import {Workers} from "../worker/workers.tsx"
import Setting from "./setting/setting.tsx";
import {WallpaperWalkInGreen} from "./wallpaper/wallpaper.tsx";
import ErrorBoundary from "./error-boundary.tsx";
import {MessageList} from "./message-list.tsx";
import Recorder from "./recorder.tsx";
import {WindowListeners} from "./window-listeners.tsx";
import {SSE} from "./network/sse.tsx";

export default function Home() {
    return (
        <div>
            <WallpaperWalkInGreen/>
            {/*<WallpaperBalloon/>*/}
            {/*<WallpaperSimultaneousCounter/>*/}
            {/*<WallpaperDefault/>*/}
            <div
                className="home flex items-center justify-center h-screen w-screen overflow-hidden gap-2 lg:p-3">
                <div
                    className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-white bg-opacity-40 backdrop-blur">
                    <MessageList/>
                    <div
                        className="flex flex-col rounded-xl items-center gap-2 w-full px-2 mt-auto bottom-0">
                        <TextArea/>
                        <div className="flex justify-center items-center w-full my-1">
                            <Recorder/>
                        </div>
                    </div>
                </div>
                <div className="h-full w-full max-w-1/3 hidden sm:block">
                    <Setting/>
                </div>
            </div>
            <ErrorBoundary>
                <SSE/>
                <Workers/>
                <WindowListeners/>
            </ErrorBoundary>
        </div>
    )
}
