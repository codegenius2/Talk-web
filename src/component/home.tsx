import TextArea from "./text-area.tsx";
import {Workers} from "../worker/workers.tsx"
import {WallpaperWalkInGreen} from "./wallpaper/wallpaper.tsx";
import ErrorBoundary from "./error-boundary.tsx";
import Recorder from "./recorder.tsx";
import {WindowListeners} from "./window-listeners.tsx";
import {SSE} from "./network/sse.tsx";
import {MessageList} from "./message/message-list.tsx";
import {Panel} from "./setting/panel.tsx";
import {useChatStore} from "../state/convs.tsx";

export default function Home() {
    const currentChatId = useChatStore(state => state.currentChatId)
    return (
        <div>
            <WallpaperWalkInGreen/>
            {/*<WallpaperBalloon/>*/}
            {/*<WallpaperSimultaneousCounter/>*/}
            {/*<WallpaperDefault/>*/}
            <ErrorBoundary>
                <div
                    className="home flex justify-center items-center h-screen w-screen overflow-hidden gap-2 p-3 lg:gap-5">
                    <div className="flex flex-col items-center h-full min-w-80">
                        <Panel/>
                    </div>
                    {currentChatId === undefined &&
                        <div
                            className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-white bg-opacity-40 backdrop-blur">
                        </div>
                    }
                    {currentChatId !== undefined &&
                        <div
                            className="flex flex-col items-center max-w-4xl w-full h-full rounded-xl justify-between gap-1 p-2
                    bg-white bg-opacity-40 backdrop-blur">
                            <MessageList/>
                            <div
                                className="flex flex-col rounded-xl items-center gap-2 w-full px-2 mt-auto bottom-0">
                                <TextArea chatId={currentChatId}/>
                                <div className="flex justify-center items-center w-full my-1">
                                    <Recorder chatId={currentChatId}/>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <SSE/>
                <Workers/>
                <WindowListeners/>
            </ErrorBoundary>
        </div>
    )
}
