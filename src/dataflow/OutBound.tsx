import React, {useEffect} from "react";

interface OutBoundProps {
    pendingText: string[],
    pendingAudio: Blob[]
}

const OutBound: React.FC<OutBoundProps> = ({pendingText, pendingAudio}) => {
    useEffect(() => {

    }, [pendingText])
    useEffect(() => {

    }, [pendingAudio])
}

export default OutBound