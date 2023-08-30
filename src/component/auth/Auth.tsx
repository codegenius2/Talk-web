import {motion} from 'framer-motion';
import React, {useState} from 'react';
import {useAuthStore} from "../../state/Auth.tsx";
import {AuthWallpaper} from "../wallpaper/AuthWallpaper.tsx";
import {useThemeStore} from "../../state/Theme.tsx";

const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    y: [0, 0, 0, 0, 0, 0],
};

export default function Auth() {
    const setVerified = useAuthStore((state) => state.setVerified);
    const setPassword = useAuthStore((state) => state.setPassword);
    const authWallpaperDark = useThemeStore((state) => state.authWallpaperDark)

    const [value, setValue] = useState('');
    const [isError, setIsError] = useState(false);

    const validatePassword = (password: string) => {
        if (password === 'ppp') {
            setVerified(true)
            setPassword(password)
            return true
        }
        return false
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!validatePassword(value)) {
            setIsError(true);
        } else {
            setIsError(false);
        }
    };

    return (
        <div>
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
                        placeholder="*******"
                        value={value}
                        autoComplete="current-password"
                        animate={isError ? shakeAnimation : {}}
                        transition={{stiffness: 300, damping: 30}}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setIsError(false);
                        }}
                        className="appearance-none w-full h-16 rounded-lg  text-slate-800 outline-0 shadow-md caret-transparent
                    text-6xl text-center tracking-widest placeholder:text-slate-400"
                    />
                </form>
            </div>
        </div>
    );
}
