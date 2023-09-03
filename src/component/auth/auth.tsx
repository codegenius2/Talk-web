import {motion} from 'framer-motion';
import React, {useCallback, useEffect, useState} from 'react';
import {useAuthStore} from "../../state/auth.tsx";
import {AxiosError, AxiosResponse} from "axios";
import {WallpaperAuth} from "../wallpaper/wallpaper.tsx";
import {useRestfulAPIStore} from "../../state/axios.tsx";

const detectDelay = 1000
const fadeOutDuration = 1500

// (0,0) -> (-500,0) -> (500,0) -> ...
const shakeAnimation = {
    x: [0, -500, 500, -500, 500, 0],
    y: [0, 0, 0, 0, 0, 0],
};

export default function Auth() {
    const setVerified = useAuthStore((state) => state.setVerified);
    const setPassword = useAuthStore((state) => state.setPassword);
    const restfulAPI = useRestfulAPIStore((state) => state.restfulAPI);
    const [isWallpaperDark, setIsWallpaperDark] = useState<boolean>(false)

    const [inputValue, setInputValue] = useState('');
    const [shake, setShake] = useState(false);
    const [startFadeOut, setStartFadeOut] = useState(false);
    const [startFadeIn, setStartFadeIn] = useState(false);

    // use this function to detect where password is required by Talk server
    const detectPassword = useCallback((shake: boolean, password?: string) => {
        setShake(false);
        restfulAPI.getHealth(password).then((r: AxiosResponse) => {
            console.info("get health response", r.status, r.data)
            if (password) {
                // password hash will be embedded within the header of subsequent requests
                setPassword(password)
            }
            setStartFadeOut(true);
            setTimeout(() => setVerified(true), fadeOutDuration)
        }).catch((e: AxiosError) => {
            console.info("get health error", e)
            setShake(shake);
            setInputValue('')
        })
    }, [restfulAPI, setVerified])

    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        detectPassword(true, inputValue)
    }, [detectPassword, inputValue, setPassword])

    // detect if login is required
    useEffect(() => {
        const t = setTimeout(() => detectPassword(false)
            , detectDelay)
        return () => clearTimeout(t)
    }, [detectPassword]);

    useEffect(() => {
        setStartFadeIn(true)
    }, []);

    return (
        // fadeOutDuration is a little shorter than duration-2000 to avoid staying in a white page
        <div className={`transition-opacity duration-2000 ${startFadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`transition-opacity duration-500 ${startFadeIn ? 'opacity-100' : 'opacity-0'}`}>
                <WallpaperAuth setDark={setIsWallpaperDark}/>
                <div
                    className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden gap-14 transition-colors">
                    <p className={"font-borel text-6xl lg:text-9xl  tracking-widest z-10 transition duration-5000 " + (isWallpaperDark ? "text-neutral-200" : "text-neutral-800")}>
                        Let's talk
                    </p>
                    <form className="max-w-3/4 w-96 mb-[25vh]" onSubmit={handleSubmit}>
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
                                "placeholder:text-neutral-200 transition duration-5000" + (isWallpaperDark ? "text-neutral-200" : "text-neutral-800")}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
