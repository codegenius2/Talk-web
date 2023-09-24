import React, {useEffect, useRef} from "react"
import Granim from "granim"
import {compareSlices} from "../util/util.tsx"

export type WallpaperAuthProps = {
    onDark?: (isDark: boolean) => void
}

export const GranimWallpaper: React.FC<WallpaperAuthProps> = ({onDark}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        const darkColor = ["#000428", "#004e92"]
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
                            darkColor,
                            ["#FF512F", "#DD2476"],
                            ["#fd746c", "#ff9068"],
                            ["#6a3093", "#a044ff"],
                            ["#76b852", "#8DC26F"],
                            ["#005C97", "#363795"]
                        ],
                    },
                },
                onGradientChange: (e) => {
                    const isDark = compareSlices(e.colorsTo, darkColor)
                    if (onDark !== undefined) {
                        onDark(isDark)
                    }
                }
            })
        }
        return () => {
            if (granim) {
                granim.destroy()
            }
        }
    }, [onDark])

    return (
        <div>
            <canvas
                ref={canvasRef}
                className="inset-0 h-screen w-screen fixed -z-50 brightness-50"
            />
            <div className="inset-0 bg-noise opacity-80 fixed h-screen w-screen brightness-150 -z-50"/>
        </div>
    )
}