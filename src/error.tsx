import {useCallback, useState} from 'react'
import {useLocation, useNavigate, useRouteError} from "react-router-dom";
import {WallpaperGranim} from "./wallpaper/wallpaper.tsx";
import {CountDownButton, ResetButton} from "./home/panel/shared/widget/button.tsx";
import {clearChats, clearSettings, currentChatProxy} from "./state/app-state.ts";
import {IoRefreshSharp} from "react-icons/io5";
import {BsTrash3} from "react-icons/bs";
import {cx} from "./util/util.tsx";

export default function Error() {

    const [textLight, setTextLight] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const error = useRouteError() as Record<string, string>;

    const onDark = useCallback((isDark: boolean) => {
        setTextLight(isDark)
    }, [])

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-around gap-3 p-3">
            <WallpaperGranim onDark={onDark}/>
            <div
                className="w-[50%] max-h-[60%] flex flex-col items-center justify-center gap-5 rounded-xl py-3 px-5
                bg-white bg-opacity-20 backdrop-blur">

                <div className={cx("flex flex-col gap-2 text-xl transition duration-5000",
                    textLight ? "text-neutral-200" : "text-neutral-800")}>
                    <p className="">We&apos;re sorry that something went wrong.</p>
                    <p className="">Here is something you can try to fix it.</p>
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
                        const chat = currentChatProxy()
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
                    icon={<BsTrash3 className="text-lg"/>}
                    action={() => {
                        clearChats()
                        navigate("/", {replace: true})
                    }}
                />
                <CountDownButton
                    text={"Clear Settings (Keep All Chats)"}
                    countDownMs={1000}
                    color="red"
                    icon={<BsTrash3 className="text-lg"/>}
                    action={() => {
                        clearSettings()
                        navigate("/", {replace: true})
                    }}
                />
                <ResetButton countDownMs={2000}/>
            </div>
            <div className={cx("relative flex w-full max-h-[50%] flex-col gap-2 overflow-auto text-black ",
                "backdrop-blur-sm border-2 border-neutral-800 rounded-xl border-dashed p-2",
                "scrollbar-visible-neutral-300")}>
                <div className="flex flex-col gap-1 whitespace-pre-line">
                    <p className="text-xl text-[#AA2C2C] brightness-75">Version</p>
                    <p className="">{"Not Available"}</p>
                </div>
                <div className="flex flex-col gap-1 whitespace-pre-line">
                    <p className="text-xl text-[#AA2C2C] brightness-75">Status</p>
                    <p className="">{error?.['statusCode'] ?? "None"} {error?.['statusText'] ?? ""}</p>
                </div>
                <div className="flex flex-col gap-1 whitespace-pre-line">
                    <p className="text-xl text-[#AA2C2C] brightness-75">Error Message</p>
                    <p className="">{error?.['message'] ?? "None"}</p>
                </div>
                <div className="flex flex-col gap-1 whitespace-pre-line">
                    <p className="text-xl text-[#AA2C2C] brightness-75">Stack trace</p>
                    <p className="">{error?.['stack'] ?? "None"}</p>
                </div>
                {error?.['stack'] &&
                    <a href="https://github.com/proxoar/talk/issues/new?assignees=&labels=&projects=&template=bug_report.md&title="
                       target="_blank"
                       className="sticky self-end right-0 bottom-0  border-neutral-800 border-dashed rounded-xl
                       px-2 py-1 text-neutral-300 opacity-80 hover:opacity-100 hover:text-neutral-100 transition duration-300"
                    > Report this on GitHub
                    </a>}
            </div>
        </div>
    )
}