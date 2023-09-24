import {SelectBox} from "./widget/select-box.tsx"
import {Choice} from "../../../data-structure/provider-api-refrence/types.ts"


type Props<T extends number | string> = {
    title: string
    choices: Choice<T>[]
    defaultValue?: T
    setValue: (value?: T) => void
    hoverOnValue?: (value?: T) => void
}

export function SelectBoxOrNotAvailable<T extends number | string>({title, choices, defaultValue, setValue,hoverOnValue}: Props<T>) {
    return (
        <div className="flex justify-start items-center gap-4">
            <p className="prose text-neutral-600">{title}</p>
            {defaultValue !== undefined && choices.length > 0 ?
                <div className="w-full overflow-x-hidden">
                    <SelectBox
                        choices={choices}
                        defaultValue={defaultValue}
                        setValue={setValue}
                        hoverOnValue={hoverOnValue}
                    />
                </div>
                :
                <div className="flex w-full justify-end text-neutral-600 line-through">
                    <div>Not Available</div>
                </div>
            }
        </div>
    )
}