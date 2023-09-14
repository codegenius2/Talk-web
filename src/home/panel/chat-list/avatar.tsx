import React, {useState} from "react";
import {getRandomElement} from "../../../util/util.tsx";
import Avatar, {genConfig} from 'react-nice-avatar'

type Props = {
    id: string
}

const avatarStyle = {
    width: '2rem',
    height: '2rem',
    minWidth: '2rem',
    minHeight: '2rem',
}

export const TalkAvatar: React.FC<Props> = ({id}) => {
    const [avatarConf] = useState(createAvatarConf(id))
    return <Avatar style={avatarStyle} shape={"circle"} className="self-center" {...avatarConf} />
}

const createAvatarConf = (id: string) => {
    const conf = genConfig(id);
    if (conf.sex === 'man') {
        conf.hairStyle = getRandomElement('normal', 'thick') // do you like mohawk? voting: (👍:0 👎:1)
    } else {
        conf.hairStyle = getRandomElement('womanLong', 'womanShort')
    }
    conf.hatStyle = 'none'
    if (Math.random() < 1 / 3) {
        conf.glassesStyle = getRandomElement('round', 'square')
    }
    if (Math.random() < 1 / 3) {
        conf.isGradient = true  // has no impact as far as I see
    }
    return conf
}