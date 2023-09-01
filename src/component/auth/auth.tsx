import {motion} from 'framer-motion';
import React, {useEffect, useState} from 'react';
import {useAuthStore} from "../../state/auth.tsx";
import {useThemeStore} from "../../state/theme.tsx";
import {getHealth} from "../../api/axios.ts";
import {AxiosError, AxiosResponse} from "axios";
import {WallpaperAuth} from "../wallpaper/wallpaper.tsx";

const detectDelay = 1000
const fadeOutDuration = 3000

const shakeAnimation = {
    x: [0, -500, 500, -500, 500, 0],
    y: [0, 0, 0, 0, 0, 0],
};

export default function Auth() {
    const setVerified = useAuthStore((state) => state.setVerified);
    const setPassword = useAuthStore((state) => state.setPassword);
    const authWallpaperDark = useThemeStore((state) => state.authWallpaperDark)

    const [inputValue, setInputValue] = useState('');
    const [shake, setShake] = useState(false);
    const [startFadeOut, setStartFadeOut] = useState(false);
    const [startFadeIn, setStartFadeIn] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // axios intercept will put password hash in the header of any request
        setPassword(inputValue)
        detectAuth(true)
    };

    const detectAuth = (shake: boolean) => {
        setShake(false);
        getHealth().then((r: AxiosResponse) => {
            console.info("get health response", r.status, r.data)
            setStartFadeOut(true);
            setTimeout(() => setVerified(true), fadeOutDuration)
        }).catch((e: AxiosError) => {
            console.info("get health error", e)
            setShake(shake);
            setInputValue('')
        })
    }

    // detect if login is required
    useEffect(() => {
        const t = setTimeout(() => detectAuth(false)
            , detectDelay)
        return () => clearTimeout(t)
    }, []);

    useEffect(() => {
        setStartFadeIn(true)
    }, []);

    return (
        <div className={`transition-opacity duration-2500 ${startFadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`transition-opacity duration-500 ${startFadeIn ? 'opacity-100' : 'opacity-0'}`}>
                <WallpaperAuth/>
                <div
                    className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden gap-14 transition-colors">
                    <p className={"font-borel text-6xl lg:text-9xl  tracking-widest z-10 transition duration-5000 " + (authWallpaperDark ? "text-neutral-200" : "text-neutral-800")}>
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
                            animate={shake ? shakeAnimation : {}}
                            transition={{stiffness: 300, damping: 30}}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShake(false);
                            }}
                            className={"appearance-none w-full h-16 rounded-lg outline-0 shadow-md caret-transparent " +
                                "text-6xl text-center tracking-widest bg-white bg-opacity-10 backdrop-blur " +
                                "placeholder:text-neutral-200 transition duration-5000" + (authWallpaperDark ? "text-neutral-200" : "text-neutral-800")}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
