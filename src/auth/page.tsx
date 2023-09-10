import {motion} from 'framer-motion';
import React, {useCallback, useEffect, useState} from 'react';
import {AxiosError, AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import {login} from "../api/restful/api.ts";
import {savePassword, setLoggedIn} from "../state/app-state.ts";
import {WallpaperAuth} from "../wallpaper/wallpaper.tsx";

const detectDelay = 1000
const fadeOutDuration = 1500

// (0,0) -> (-500,0) -> (500,0) -> ...
const shakeAnimation = {
    x: [0, -500, 500, -500, 500, 0],
    y: [0, 0, 0, 0, 0, 0],
};

export default function Auth() {
    const navigate = useNavigate()

    const [textLight, setTextLight] = useState<boolean>(false)

    const [inputValue, setInputValue] = useState('');
    const [shake, setShake] = useState(false);
    const [startFadeOut, setStartFadeOut] = useState(false);
    const [startFadeIn, setStartFadeIn] = useState(false);


    // use this function to detect where password is required by Talk server
    const detectPassword = useCallback((shake: boolean, password?: string) => {
        setShake(false);
        login(password).then((r: AxiosResponse) => {
            console.info("login is successful", r.status, r.data)
            if (password) {
                savePassword(password)
            }
            setLoggedIn(true)
            setStartFadeOut(true);
            setTimeout(() => navigate("/chat"), fadeOutDuration)
        }).catch((e: AxiosError) => {
            console.info("failed to login", e)
            setShake(shake);
            setInputValue('')
        })
    }, [navigate])


    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        detectPassword(true, inputValue)
    }, [detectPassword, inputValue])

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
        // fadeOutDuration is shorter than duration-2000 to avoid staying in a white page
        <div className={`transition-opacity duration-2000 ${startFadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`transition-opacity duration-300 ${startFadeIn ? 'opacity-100' : 'opacity-0'}`}>
                {<WallpaperAuth onDark={(isDark)=>setTextLight(isDark)}/>}
                <div
                    className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden gap-14 transition-colors">
                    <p className={"font-borel text-7xl md:text-8xl lg:text-9xl tracking-widest z-10 transition duration-5000 " + (textLight ? "text-neutral-200" : "text-neutral-800")}>
                        Let&apos;s talk
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
                                "placeholder:text-neutral-200 transition duration-5000" + (textLight ? "text-neutral-200" : "text-neutral-800")}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}
