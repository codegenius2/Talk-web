import React, {useEffect, useState} from "react";
import {useMouseStore} from "../../state/Mouse.tsx";

type Opt = {
    value: number
    mark: string
}

type  Props = {
    options: Opt[]
    value: number
    setValue: (value: number) => void
    // use this color as bg if not in range
    bgColor: string
}

type OpColor = {
    index: number
    option: Opt
    inRange: boolean
}

export const DiscreteRange: React.FC<Props> = ({options, value, setValue, bgColor}) => {

    const [opColors, setOpColors] = useState<OpColor[]>([])

    useEffect(() => {

        const res: OpColor[] = []
        for (let i = 0; i < options.length; i++) {
            res.push({
                index: i,
                option: options[i],
                // only render color when div is in selected range
                inRange: value !== undefined && options[i].value <= value
            })
        }
        setOpColors(res)
        return () => {
            setOpColors([])
        }
    }, [options, bgColor, value, setValue])

    const handleMouseLeaveFirstElement = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (useMouseStore.getState().isMouseDown) {
            const {clientY} = event;
            const {right} = event.currentTarget.getBoundingClientRect();
            // if mouse doesn't leave from right side
            if (clientY < right) {
                setValue(0)
            }
        }
    }

    const handleMouseEnterChild = (oc: OpColor) => {
        if (useMouseStore.getState().isMouseDown) {
            setValue(oc.option.value)
        }
    }

    const handleMouseDownChild = (oc: OpColor) => {
        setValue(oc.option.value)
    }

    return (
        <div className="flex flex-grow items-center divide-x h-full bg-white">
            {opColors.map((oc: OpColor) =>
                <div className={"flex justify-center items-center w-full " + (oc.inRange ? bgColor : "")}
                     key={oc.index}
                     onMouseLeave={oc.index == 0 ? handleMouseLeaveFirstElement : () => {
                     }}
                     onMouseDown={() => handleMouseDownChild(oc)}
                     onMouseEnter={() => handleMouseEnterChild(oc)}
                >
                    <p className={"prose text-center px-0.5  " + (oc.inRange ? "text-equal-100" : "")}>{oc.option.mark}</p>
                </div>
            )}
        </div>
    );

}