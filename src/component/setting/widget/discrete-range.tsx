import React, {useEffect, useState} from "react";
import {useMouseStore} from "../../../state/Mouse.tsx";
import {Choice, NumStr} from "../../../ds/ability/client-ability.tsx";

type Props = {
    choices: Choice[]
    value: NumStr
    setValue: (value: NumStr) => void
    outOfLeftBoundary?: NumStr // whether set value to this as mouse moves out of left-most element, usually as zero
}

type ChoiceColor = {
    index: number
    choice: Choice
    inRange: boolean
}

const switchBgColor = "bg-blue-600"
export const DiscreteRange: React.FC<Props> = ({choices, value, setValue, outOfLeftBoundary}) => {

    const [choicesContainsValue, setChoicesContainsValue] = useState<ChoiceColor[]>([])
    const [containsValue, setContainsValue] = useState<boolean>(false)

    useEffect(() => {

        const res: ChoiceColor[] = []
        const contain = choices.find(it => it.value == value) !== undefined
        for (let i = 0; i < choices.length; i++) {
            res.push({
                index: i,
                choice: choices[i],
                // only render color when div is in selected range
                inRange: contain && value !== undefined && choices[i].value <= value
            })
        }
        setContainsValue(contain)
        setChoicesContainsValue(res)
    }, [choices, value, setValue])

    const handleMouseLeaveFirstElement = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (outOfLeftBoundary === undefined) {
            return
        }
        if (useMouseStore.getState().isMouseDown) {
            const {clientY} = event;
            const {right} = event.currentTarget.getBoundingClientRect();
            // if mouse doesn't leave from right side
            if (clientY < right) {
                setValue(outOfLeftBoundary)
            }
        }
    }

    const handleMouseEnterChild = (oc: ChoiceColor) => {
        if (useMouseStore.getState().isMouseDown) {
            setValue(oc.choice.value)
        }
    }

    const handleMouseDownChild = (oc: ChoiceColor) => {
        setValue(oc.choice.value)
    }

    return (
        <div className="flex gx-2">
            <textarea
                className={" " + containsValue ? "bg-slate-500" : "bg-transparent"}
                onChange={e => setValue(e.target.value)}
                value={value}
            >
            </textarea>
            <div
                className={"flex flex-wrap items-center divide-x divide-opacity-0 h-full bg-white "
                + containsValue ? "bg-transparent" : "bg-slate-500"}>
                {choicesContainsValue.map((oc: ChoiceColor) =>
                    <div className={"flex justify-center items-center flex-grow " + (oc.inRange ? switchBgColor : "")}
                         key={oc.index}
                         onMouseLeave={oc.index == 0 ? handleMouseLeaveFirstElement : () => {
                         }}
                         onMouseDown={() => handleMouseDownChild(oc)}
                         onMouseEnter={() => handleMouseEnterChild(oc)}
                    >
                        <p className={"prose text-center px-0.5  " + (oc.inRange ? "text-equal-100" : "")}>
                            {oc.choice.name}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

}