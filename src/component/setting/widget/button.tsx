import {BsBootstrapReboot, BsTrash3} from "react-icons/bs";
import React, {useState} from "react";
import Countdown from "react-countdown";

type Props = {
    countDownMs: number
    action: () => void
}

export const ClearMessageButton: React.FC<Props> = ({action, countDownMs}) => {

    const [holding, setHolding] = useState(false)

    return <div className={"flex items-center border border-red-600 rounded-lg gap-1 px-2 py-0.5 " +
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
                action()
            }}
            intervalDelay={0}
            precision={1}
            autoStart={true}
            renderer={props => <p className="font-light whitespace-nowrap text-center w-26">{props.total / 1000}</p>}
        />}
        {!holding && <p className="font-light whitespace-nowrap text-center w-26">Clear Message</p>}
    </div>
}

export const ResetButton: React.FC<Props> = ({action, countDownMs}) => {
    const [holding, setHolding] = useState(false)

    return <div className={"flex items-center border border-black rounded-lg gap-1 px-2 py-0.5 " +
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
                action()
            }}
            intervalDelay={0}
            precision={1}
            autoStart={true}
            renderer={props => <p className="whitespace-nowrap text-center w-12">{props.total / 1000}</p>}
        />}
        {!holding && <p className="whitespace-nowrap text-center w-12">Reset</p>}
    </div>
}