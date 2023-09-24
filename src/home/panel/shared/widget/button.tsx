import React, {useCallback, useState} from "react"
import Countdown from "react-countdown"
import {useNavigate} from "react-router-dom"
import {audioDb} from "../../../../state/db.ts"
import {resetAppState} from "../../../../state/app-state.ts"
import {BsBootstrapReboot} from "react-icons/bs"
import {cx} from "../../../../util/util.tsx"

type Color = 'red' | 'blue' | 'black'

type Props = {
    text: string
    countDownMs: number
    color: Color
    icon?: React.JSX.Element
    action?: () => void
}

export const CountDownButton: React.FC<Props> = ({
                                                     text,
                                                     countDownMs,
                                                     icon,
                                                     color,
                                                     action,
                                                 }) => {

    const [holding, setHolding] = useState(false)

    return <div className={
        cx(
            "cursor-pointer flex items-center bg-white bg-opacity-60 rounded-lg gap-1 px-2 py-0.5",
            "hover:text-neutral-100 hover:border-transparent transition duration-300 border select-none",
            color === "red" && "border-red-600 text-red-600 hover:bg-red-600",
            color === "blue" && "border-blue-600 text-blue-600 hover:bg-blue-600",
            color === "black" && "border-black text-black hover:bg-black",
            holding && "scale-110"
        )}
                onMouseDown={(e) => {
                    if (e.button === 0) {
                        // only respond to left-click
                        setHolding(true)
                    }
                }}
                onMouseUp={() => setHolding(false)}
                onMouseLeave={() => setHolding(false)}
                onContextMenu={(e) => {
                    e.preventDefault()
                    setHolding(false)
                }}>
        {icon}

        <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                {holding && <Countdown
                    date={Date.now() + countDownMs}
                    onComplete={() => {
                        setHolding(false)
                        if (action) {
                            action()
                        }
                    }}
                    intervalDelay={0}
                    precision={1}
                    autoStart={true}
                    renderer={props => <p
                        className="whitespace-nowrap text-center font-light">{props.total / 1000}</p>}
                />}
            </div>
            <p className={cx("whitespace-nowrap text-center font-light", holding && "opacity-0")}>
                {text}
            </p>
        </div>
    </div>
}

type CountDwnProps = {
    countDownMs: number
}

export const ResetButton: React.FC<CountDwnProps> = ({countDownMs = 2000}) => {
    const navigate = useNavigate()
    const reset = useCallback(() => {
        audioDb.clear(() => {
        }).catch(e => {
                console.error("failed to clear audio blobs:", e)
            }
        ).finally(() => {
                resetAppState()
                console.info("reset")
                navigate("/")
            }
        )
    }, [navigate])

    return <CountDownButton text={"Reset Everything"}
                            countDownMs={countDownMs}
                            color={"black"}
                            action={reset}
                            icon={<BsBootstrapReboot className="text-lg"/>}
    />
}
