import {useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {WallpaperAuth} from "./wallpaper/wallpaper.tsx";
import {CountDownButton, ResetButton} from "./home/panel/shared/widget/button.tsx";
import {appState} from "./state/app-state.ts";
import {IoRefreshSharp} from "react-icons/io5";
import {BsTrash3} from "react-icons/bs";

export default function Error() {

    const [textLight, setTextLight] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <WallpaperAuth onDark={(isDark) => setTextLight(isDark)}/>
            <div
                className="w-1/2 h-1/2 flex flex-col items-center justify-center gap-5 rounded-xl pt-1 pb-3 px-3
                bg-white bg-opacity-20 backdrop-blur">

                <div className={"prose text-xl  " + (textLight ? "text-neutral-200" : "text-neutral-800")}>
                    <p>We&apos;re sorry that something went wrong.</p>
                    <br/>
                    <p className="">Here is something you can try to fix it.</p>
                    <br/>
                    <p className="">Try them one by one until back to normal.</p>
                </div>
                <CountDownButton text={"Refresh"}
                                 countDownMs={0}
                                 color="blue"
                                 action={() => navigate(location.pathname, {replace: true})}
                                 icon={<IoRefreshSharp className="text-lg"/>}
                />
                <CountDownButton
                    text={"Clear Messages of Current Chat"}
                    countDownMs={1000}
                    color="red"
                    icon={<BsTrash3 className="text-lg"/>}
                    action={() => {
                        const chat = appState.chats[appState.currentChatId]
                        if (chat) {
                            chat.messages = []
                        }
                        navigate("/", {replace: true})
                    }}
                />
                <CountDownButton
                    text={"Clear All Chats"}
                    countDownMs={1000}
                    color="red"
                    icon={undefined}
                    action={() => {
                        appState.chats = {}
                        navigate("/", {replace: true})
                    }}
                />
                <ResetButton countDownMs={2000}/>
            </div>
        </div>
    )
}