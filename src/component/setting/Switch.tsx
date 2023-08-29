import React from 'react'
import {Switch} from '@headlessui/react'

export type  MySwitchProps = {
    switchColor: string
    enabled: boolean
    setEnabled: (enabled: boolean) => void
}

export const MySwitch: React.FC<MySwitchProps> = ({switchColor, enabled, setEnabled}) => {

    return (
        <div className="flex items-center">
            <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? switchColor : 'bg-gray-200'}
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
             pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-2xl ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
        </div>
    )
}
