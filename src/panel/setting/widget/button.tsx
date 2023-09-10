import {BsBootstrapReboot, BsTrash3} from "react-icons/bs";
import React, {useCallback, useState} from "react";
import Countdown from "react-countdown";
import {IoRefreshSharp} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {audioDb} from "../../../state/db.ts";
import {resetAppState} from "../../../state/app-state.ts";

type Props = {
    countDownMs: number
    action?: () => void
    text: string
    width?: string
}

export const RefreshButton: React.FC<Props> = ({
                                                   action
                                                   , countDownMs
                                                   , text,
                                                   width = "w-20"
                                               }) => {

    const [holding, setHolding] = useState(false)

    return <div className={"cursor-pointer flex items-center border border-blue-600 rounded-lg gap-1 px-2 py-0.5 " +
        "text-blue-600 bg-white bg-opacity-60 hover:bg-blue-600  hover:text-neutral-100 hover:border-transparent " +
        "transition duration-300 " + (holding ? "scale-110" : "")}
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onMouseLeave={() => setHolding(false)}
                onContextMenu={() => {
                    setHolding(false)
                }}>
        <IoRefreshSharp className="text-lg"/>
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
                className={"font-light whitespace-nowrap text-center " + width}>{props.total / 1000}</p>}
        />}
        {!holding && <p className={"font-light whitespace-nowrap text-center " + width}>{text}</p>}
    </div>
}

export const ClearButton: React.FC<Props> = ({
                                                 action
                                                 , countDownMs
                                                 , text,
                                                 width = "w-26"
                                             }) => {

    const [holding, setHolding] = useState(false)

    return <div className={"cursor-pointer flex items-center border border-red-600 rounded-lg gap-1 px-2 py-0.5 " +
        "text-red-600 bg-white bg-opacity-60 hover:bg-red-600  hover:text-neutral-100 hover:border-transparent " +
        "transition duration-300 " + (holding ? "scale-110" : "")}
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onMouseLeave={() => setHolding(false)}
                onContextMenu={() => {
                    setHolding(false)
                }}
    >
        <BsTrash3 className="text-lg"/>
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
                className={"font-light whitespace-nowrap text-center " + width}>{props.total / 1000}</p>}
        />}
        {!holding && <p className={"font-light whitespace-nowrap text-center " + width}>{text}</p>}
    </div>
}

type ResetButtonProps = {
    countDownMs: number
    width?: string
}

export const ResetButton: React.FC<ResetButtonProps> = ({countDownMs, width = "w-32"}) => {
    const [holding, setHolding] = useState(false)

    const navigate=useNavigate()

    const reset = useCallback(() => {
        audioDb.clear(() => {
        }).catch(e => {
                console.error("failed to clear audio blobs:", e)
            }
        ).finally(() => {
                resetAppState()
                console.info("reset")
                navigate("/auth")
            }
        )

    }, [navigate]);


    return <div className={"cursor-pointer flex items-center border border-black rounded-lg gap-1 px-2 py-0.5 " +
        "text-black bg-white bg-opacity-60 hover:bg-black  hover:text-white hover:border-transparent " +
        "transition duration-300 " + (holding ? "scale-110" : "")}
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onMouseLeave={() => setHolding(false)}
                onContextMenu={() => {
                    setHolding(false)
                }}
    >
        <BsBootstrapReboot className="text-lg"/>
        {holding && <Countdown
            date={Date.now() + countDownMs}
            onComplete={() => {
                setHolding(false)
                reset()
            }}
            intervalDelay={0}
            precision={1}
            autoStart={true}
            renderer={props => <p className={"whitespace-nowrap text-center " + width}>{props.total / 1000}</p>}
        />}
        {!holding && <p className={"whitespace-nowrap text-center " + width}>Reset Everything</p>}
    </div>
}