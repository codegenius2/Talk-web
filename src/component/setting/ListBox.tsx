import {Fragment, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import {joinClassNames} from "../../util/Util.tsx";

// https://tailwindui.com/components/application-ui/forms/select-menus

export default function ListBox() {
    const [selected, setSelected] = useState(options[3])


    return (
        <Listbox value={selected} onChange={setSelected} >
            {({open}) => (
                <div className="relative">
                    <Listbox.Button
                        className="relative w-full cursor-default rounded-2xl bg-white py-0.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm sm:leading-6">
                          <span className="flex items-center truncate">
                            <span className="ml-3">{selected.name}</span>
                          </span>
                        <span
                            className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                          </span>
                    </Listbox.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="absolute w-full rounded-xl text-base
                            shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
                            bg-white bg-opacity-70 backdrop-blur">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.id}
                                    value={option}
                                    className={({active}) =>
                                        joinClassNames(
                                            active ? 'bg-blue-600 text-white' : 'text-gray-900',
                                            'rounded-lg relative cursor-default select-none py-0.5 pl-3 pr-0.5'
                                        )
                                    }
                                >
                                    {({selected, active}) => (
                                        <>
                                            {selected ? (
                                                <CheckIcon className={joinClassNames(
                                                    active ? 'text-white' : 'text-gray-900', 'absolute inset-x-0 left-0 h-5 w-5'
                                                )} aria-hidden="true"/>) : null}
                                            <div className="flex items-center w-full ">
                                                    <span
                                                        className={joinClassNames(selected ? 'font-semibold' : 'font-normal', 'flex flex-wrap justify-between items-center w-full ml-3')}
                                                    >
                                                    <p className="m-0">{option.name}</p>
                                                    <div className='flex justify-between items-center gap-1 '>
                                                         {option.tags.map(tag =>
                                                             <span
                                                                 className="bg-gray-400 text-white rounded-md px-1 text-xs">{tag}</span>
                                                         )}
                                                        </div>
                                                  </span>
                                            </div>

                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    )
}

export type LBOption = {
    id: string | number,
    name: string,
    tags: string[]
}
const options: LBOption[] = [
    {
        id: 1,
        name: 'Wade Cooper',
        tags: ["male", "US"]
    },
    {
        id: 2,
        name: 'Arlene Mccoy',
        tags: ["male", "US"]
    },
    {
        id: 3,
        name: 'Devon Webb',
        tags: ["female", "GB"]
    },
    {
        id: 4,
        name: 'Tom Cook',
        tags: ["female", "GB"]
    },
    {
        id: 5,
        name: 'Tanya Fox',
        tags: ["female", "GB"]
    },
    {
        id: 6,
        name: 'Hellen Schmidt',
        tags: ["female", "GB"]
    },
    {
        id: 7,
        name: 'Caroline Schultz',
        tags: ["female", "GB"]
    },
    {
        id: 8,
        name: 'Mason Heaney',
        tags: []
    },
    {
        id: 9,
        name: 'Claudie Smitham',
        tags: ["female", "GB", "warm"]
    },
    {
        id: 10,
        name: 'Emil Schaefer',
        tags: ["female", "GB"]
    },
]
