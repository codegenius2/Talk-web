import {useSelect} from "downshift";
import {cx} from "../../../../util/util.tsx";
import {Choice} from "../../../../data-structure/provider-api-refrence/types.ts";
import {useEffect} from "react";

type Props<T extends number | string> = {
    choices: Choice<T>[]
    defaultValue: T
    setValue: (value: T) => void
}

export function SelectBoxExample<T extends number | string>({choices, defaultValue, setValue}: Props<T>) {

    const {
        isOpen,
        selectedItem,
        getToggleButtonProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        selectItem
    } = useSelect({
        defaultSelectedItem: choices[0],
        items: choices,
        itemToString:
            c => c!.name,
        onSelectedItemChange:
            ({selectedItem: newSelectedItem}) => setValue(newSelectedItem!.value)
    })

    useEffect(() => {
        const ft = choices.filter(c => c.value === defaultValue)
        if (ft.length !== 1) {
            console.error("ft:", ft)
            console.error("defaultValue:", defaultValue)
            throw new Error("one and only one of choices must equal value")
        }
        selectItem(ft[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    return (
            <div className="">
            <p className="prose border border-neutral-500 rounded-xl cursor-pointer text-neutral-800 px-1.5
             truncate ... outline-none bg-white bg-opacity-50 backdrop-blur"
               {...getToggleButtonProps()}>
                {selectedItem!.name}
            </p>
            <ul
                className={cx("z-50 bg-opacity-40 backdrop-blur absolute bg-white mt-1 max-h-80",
                    " overflow-y-scroll  rounded-xl bg-neutral-200 w-64",
                    !(isOpen) && 'hidden')}
                {...getMenuProps()}
            >
                {isOpen &&
                    choices.map((c, index) => (
                        <li
                            className={cx(
                                highlightedIndex === index && "bg-white/[0.35]",
                                selectedItem!.value === c.value && 'bg-white/[0.8]',
                                'rounded-xl py-1.5 px-1.5 shadow-sm flex flex-col',
                            )}
                            key={`${c.value}${index}`}
                            {...getItemProps({item: c, index})}
                        >
                            <div className="flex items-center justify-between gap-4 pr-1 w-full">
                                <div className="rewrite-this-whitespace-nowrap">{c.name}</div>
                                <div className="rewrite-this-whitespace-nowrap text-sm text-gray-700">{c.tags.join(" ")}</div>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    )
}