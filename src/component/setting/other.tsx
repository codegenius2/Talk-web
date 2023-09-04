import React, {useCallback, useEffect, useState} from 'react';
import {useConvStore} from "../../state/conversation.tsx";
import {BsBootstrapReboot, BsTrash3} from "react-icons/bs";
import {zustandStorage} from "../../persist/zustant-db.tsx";
import {clearBlob} from "../../persist/blob-db.tsx";

const Other: React.FC = () => {
        const clearQsSlice = useConvStore((state) => state.clearQsSlice)
        const [zustandCleared, setZustandCleared] = useState(false)
        const [blobCleared, setBlobCleared] = useState(false)

        const reset = useCallback(() => {
            zustandStorage.clear()
                .then(() => setZustandCleared(true))
                .catch(e => console.error("failed to clear zustand", e))
            clearBlob()
                .then(() => setBlobCleared(true))
                .catch(e => console.error("failed to clear blob", e))
        }, [])

        useEffect(() => {
            if (zustandCleared && blobCleared) {
                console.info("rested")
                window.location.reload()
            }
        }, [zustandCleared, blobCleared])

        return <div
            className="flex flex-col w-full items-center justify-between gap-2 px-3 py-4 rounded-xl bg-white
            bg-opacity-40 backdrop-blur">
            <div className="flex justify-between items-center w-full px-3 ">
                <p className="prose text-lg text-neutral-600">Other</p>
            </div>
            <div
                className="flex flex-wrap justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed rounded-lg w-full px-3">
                <div className="flex items-center border border-red-600 rounded-lg gap-1 px-2 py-0.5
                text-red-600 bg-white bg-opacity-60 hover:bg-red-600  hover:text-neutral-100 hover:border-transparent hover:scale-110
                transition duration-300"
                     onClick={clearQsSlice}
                >
                    <BsTrash3 className="text-lg"/>
                    <p className="font-light whitespace-nowrap">Clear Message</p>
                </div>
                <div className="flex items-center border border-black rounded-lg gap-1 px-2 py-0.5
                text-black bg-white bg-opacity-60 hover:bg-black  hover:text-white hover:border-transparent hover:scale-110
                transition duration-300"
                     onClick={reset}
                >
                    <BsBootstrapReboot className="text-lg"/>
                    <p className="whitespace-nowrap">Reset All</p>
                </div>
            </div>
        </div>
    }
;

export default Other;

