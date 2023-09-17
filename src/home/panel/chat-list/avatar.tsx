import React, {useEffect, useState} from "react";
import Avatar, {genConfig, GlassesStyle, HairStyle} from 'react-nice-avatar'

type Props = {
    id: string
}

const avatarStyle = {
    width: '2rem',
    height: '2rem',
    minWidth: '2rem',
    minHeight: '2rem',
}
const dftConf = genConfig()

export const TalkAvatar: React.FC<Props> = ({id}) => {
    const [avatarConf,setAvatarConf] = useState(dftConf)
    useEffect(() => {
        const conf =createAvatarConf(id)
        setAvatarConf(conf)
    }, [id]);
    return <Avatar style={avatarStyle} shape={"circle"} className="self-center" {...avatarConf} />
}

const createAvatarConf = (id: string) => {
    const conf = genConfig(id);
    if (conf.sex === 'man') {
        // do you like mohawk? voting: (👍:0 👎:1)
        conf.hairStyle = ['normal', 'thick'][id[0].charCodeAt(0) % 2] as HairStyle
    } else {
        conf.hairStyle = ['womanLong', 'womanShort'][id[1].charCodeAt(0) % 2] as HairStyle
    }
    conf.hatStyle = 'none'
    if (id[2].charCodeAt(0) % 3 == 0) {
        conf.glassesStyle = ['round', 'square'][id[3].charCodeAt(0) % 2] as GlassesStyle
    }
    if (id[4].charCodeAt(0) % 3 == 0) {
        conf.isGradient = true  // has no impact as far as I see
    }
    return conf
}