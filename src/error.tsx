import  {useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {WallpaperAuth} from "./wallpaper/wallpaper.tsx";
import {ClearButton, RefreshButton, ResetButton} from "./panel/setting/widget/button.tsx";
import {appState} from "./state/app-state.ts";

export default function Error() {

    const [textLight, setTextLight] = useState(false)
    const navigate = useNavigate();
  const location = useLocation();


    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <WallpaperAuth onDark={(isDark) => setTextLight(isDark)}/>
            <div
                className="w-1/2 h-1/2 flex flex-col items-center justify-center gap-5 rounded-xl pt-1 pb-3 px-3
                bg-white bg-opacity-20 backdrop-blur
            ">
                <div className={"prose text-xl  " + (textLight ? "text-neutral-200" : "text-neutral-800")}>
                    <p>We&apos;re sorry that something went wrong.</p>
                    <br/>
                    <p className="">Here is something you can try to fix it.</p>
                    <br/>
                    <p className="">Try them one by one until back to normal.</p>
                </div>
                <RefreshButton
                    text={"Refresh"}
                    action={() =>  navigate(location.pathname, { replace: true })}
                    countDownMs={100}
                ></RefreshButton>
                <ClearButton
                    text={"Clear All Chats"}
                    action={() => {
                        appState.chats = {}
                         navigate("/auth", { replace: true })
                    }}
                    countDownMs={1000}
                    width={"w-28"}
                />
                <ResetButton countDownMs={1000}/>
            </div>
        </div>
    )
}