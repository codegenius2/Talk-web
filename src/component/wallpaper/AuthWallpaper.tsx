import React, {useEffect, useRef} from 'react';
import Granim from 'granim';
import {useThemeStore} from "../../state/Theme.tsx";
import {compareSlices} from "../../util/Util.tsx";

export const AuthWallpaper: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const setAuthWallpaperDark = useThemeStore((state) => state.setAuthWallpaperDark)

    useEffect(() => {
        let g: Granim
        if (canvasRef.current) {
            g = new Granim({
                element: canvasRef.current,
                direction: "diagonal",
                states: {
                    "default-state": {
                        gradients: [
                            ["#00d2ff", "#3a7bd5"],
                            ["#4776E6", "#8E54E9"],
                            ["#000428", "#004e92"],
                            ["#FF512F", "#DD2476"],
                            ["#fd746c", "#ff9068"],
                            ["#6a3093", "#a044ff"],
                            ["#76b852", "#8DC26F"],
                            ["#005C97", "#363795"]
                        ],
                    },
                },
                onGradientChange: (e) => {
                    const isDark = compareSlices(e.colorsTo, ["#000428", "#004e92"])
                    setAuthWallpaperDark(isDark)
                    console.debug("isDark", isDark)
                }
            });
        }
        return () => {
            if (g) {
                g.destroy()
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