import React, {useCallback, useEffect, useState} from 'react';
import {ResetButton} from "./widget/button.tsx";
import {zustandStorage} from "../../../persist/zustant-db.tsx";
import {clearBlob} from "../../../persist/blob-db.tsx";


export const GlobalSetting: React.FC = () => {
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
        className="flex flex-col w-full items-center justify-between gap-2 rounded-xl bg-white
            bg-opacity-40 backdrop-blur pt-1 pb-3 px-3 ">
        <div className="flex justify-between items-center w-full px-3 ">
            <p className="prose text-lg text-neutral-600">Other</p>
        </div>
        <div
            className="flex flex-wrap justify-start items-center gap-2 py-2 border-2 border-neutral-500 border-dashed rounded-lg w-full px-3">
            <ResetButton action={reset} countDownMs={2000}/>
        </div>
    </div>
}

