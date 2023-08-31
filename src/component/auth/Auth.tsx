import {motion} from 'framer-motion';
import React, {useEffect, useState} from 'react';
import {useAuthStore} from "../../state/Auth.tsx";
import {AuthWallpaper} from "../wallpaper/AuthWallpaper.tsx";
import {useThemeStore} from "../../state/Theme.tsx";
import {getHealth} from "../../api/axios.ts";
import {AxiosError, AxiosResponse} from "axios";

const detectDelay = 1000
const fadeOutDuration = 2000

const shakeAnimation = {
    x: [0, -500, 500, -500, 500, 0],
    y: [0, 0, 0, 0, 0, 0],
};

export default function Auth() {
    const setVerified = useAuthStore((state) => state.setVerified);
    const setPassword = useAuthStore((state) => state.setPassword);
    const authWallpaperDark = useThemeStore((state) => state.authWallpaperDark)

    const [inputValue, setInputValue] = useState('');
    const [isError, setIsError] = useState(false);
    const [startFadeOut, setStartFadeOut] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // axios intercept will put password hash in the header of any request
        setPassword(inputValue)
        detectAuth()
    };

    const detectAuth = () => {
        getHealth().then((r: AxiosResponse) => {
            console.info("get health response", r.status, r.data)
            setIsError(false);
            setStartFadeOut(true);
            setTimeout(() => setVerified(true), fadeOutDuration)
        }).catch((e: AxiosError) => {
            console.info("get health error", e)
            setIsError(true);
            setInputValue('')
        })
    }

    // detect if login is required
    useEffect(() => {
        const t = setTimeout(() => detectAuth()
            , detectDelay)
        return () => clearTimeout(t)
    }, []);

    return (
        <div className={`transition-opacity duration-${fadeOutDuration} ${startFadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <AuthWallpaper/>
            <div
                className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden gap-14 transition-colors">
                <p className={"font-borel text-6xl lg:text-9xl  tracking-widest z-10 transition duration-5000 " + (authWallpaperDark ? "text-equal-200" : "text-equal-800")}>
                    Let's talk
                </p>
                <form className="z-10 max-w-3/4 w-96 mb-[25vh]" onSubmit={handleSubmit}>
                    {/*<input type="text" id="username" hidden={true} autoComplete="current-password" aria-hidden="true" required={false}/>*/}
                    <motion.input
                        type="password"
                        inputMode="url"
                        id="password"
                        value={inputValue}
                        autoComplete="current-password"
                        animate={isError ? shakeAnimation : {}}
                        transition={{stiffness: 300, damping: 30}}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setIsError(false);
                        }}
                        className={"appearance-none w-full h-16 rounded-lg outline-0 shadow-md caret-transparent " +
                            "text-6xl text-center tracking-widest bg-white bg-opacity-10 backdrop-blur " +
                            "placeholder:text-equal-200 transition duration-5000" + (authWallpaperDark ? "text-equal-200" : "text-equal-800")}
                    />
                </form>
            </div>
        </div>
    );
}
