import './HomeWallpaper.css'

export default function HomeWallpaper() {
    return <div className="home-wallpaper absolute w-full h-full -z-10" style={{position: 'fixed'}}/>
}


export const wpStyleSkyPink = {
    backgroundColor: '#FFDEE9',
    backgroundImage: 'linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)'
}

export const wpStyleGreenPurple = {
    backgroundColor: '#3EECAC',
    backgroundImage: 'linear-gradient(68deg, #3EECAC 0%, #EE74E1 100%)'
}

export const wpStyleBluePeach = {
    backgroundImage: 'radial-gradient( circle 311px at 8.6% 27.9%,  rgba(62,147,252,0.57) 12.9%, rgba(239,183,192,0.44) 91.2% )'
}
export const wpStyleCyanPurple = {
    backgroundColor: '#D9AFD9',
    backgroundImage: 'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)'
}
