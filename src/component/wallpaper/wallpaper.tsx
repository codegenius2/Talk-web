import './Wallpaper.css'
import React, {useEffect, useRef} from "react";
import {useThemeStore} from "../../state/theme.tsx";
import Granim from "granim";
import {compareSlices} from "../../util/util.tsx";

export function WallpaperDefault() {
    return <div>
        <div className="wp-default w-full h-full brightness-75 -z-10"/>
        <div className="bg-noise opacity-80 fixed h-full w-full contrast-200 brightness-200 -z-10"/>
    </div>
}

export const WallpaperAuth: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const setAuthWallpaperDark = useThemeStore((state) => state.setAuthWallpaperDark)
    const dark = ["#000428", "#004e92"]
    useEffect(() => {
        let granim: Granim
        if (canvasRef.current) {
            granim = new Granim({
                element: canvasRef.current,
                direction: "diagonal",
                states: {
                    "default-state": {
                        gradients: [
                            ["#00d2ff", "#3a7bd5"],
                            ["#4776E6", "#8E54E9"],
                            dark,
                            ["#FF512F", "#DD2476"],
                            ["#fd746c", "#ff9068"],
                            ["#6a3093", "#a044ff"],
                            ["#76b852", "#8DC26F"],
                            ["#005C97", "#363795"]
                        ],
                    },
                },
                onGradientChange: (e) => {
                    const isDark = compareSlices(e.colorsTo, dark)
                    setAuthWallpaperDark(isDark)
                }
            });
        }
        return () => {
            if (granim) {
                granim.destroy()
            }
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute w-full h-full -z-10"
            style={{position: 'fixed'}}
        />
    );
}

// wikiart.org public domain arts, completely free to use

export function WallpaperSimultaneousCounter() {
    return <div>
        {/* to hide the white edge of blur*/}
        <div
            className="bg-simultaneous-counter-composition-1930 bg-center bg-cover fixed -mt-5 -ml-5 w-screen-105 h-screen-105 blur-lg brightness-75 -z-10"/>
        <div className="bg-noise opacity-80 fixed h-full w-full contrast-200 brightness-200 -z-10"/>
    </div>
}

export const wpStyleSkyPink = {
    backgroundColor: '#FFDEE9',
    backgroundImage:
        'linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)'
}

export const wpStyleGreenPurple = {
    backgroundColor: '#3EECAC',
    backgroundImage:
        'linear-gradient(68deg, #3EECAC 0%, #EE74E1 100%)'
}

export const wpStyleBluePeach = {
    backgroundImage: 'radial-gradient( circle 311px at 8.6% 27.9%,  rgba(62,147,252,0.57) 12.9%, rgba(239,183,192,0.44) 91.2% )'
}
export const wpStyleCyanPurple = {
    backgroundColor: '#D9AFD9',
    backgroundImage:
        'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)'
}


// we have no copyright. limited to personal use. do not put them on a website that is public accessible
// see https://www.behance.net/gallery/84818869/Fuzzies-vol-1

export function WallpaperBalloon() {
    return <div>
        {/* to hide the white edge of blur*/}
        <div className="bg-balloon bg-cover fixed -mt-5 -ml-5 w-screen-105 h-screen-105 blur-lg brightness-75 -z-10"/>
        <div className="bg-noise opacity-80 fixed h-full w-full contrast-200 brightness-200 -z-10"/>
    </div>
}

export function WallpaperWalkInGreen() {
    return <div>
        {/* to hide the white edge of blur*/}
        <div
            className="bg-walk-in-green bg-cover bg-center fixed -mt-5 -ml-5 w-screen-105 h-screen-105 blur-lg brightness-75 -z-10"/>
        <div className="bg-noise opacity-80 fixed h-full w-full contrast-200 brightness-200 -z-10"/>
    </div>
}

