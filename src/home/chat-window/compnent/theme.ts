export type Theme = {
    bg: string
    text: string
    normalIcon: string
    warningIcon: string
    historyIcon: string
    playBg: string
    play: string
    pause: string
    wave: string
    progress: string
    hoverLine: string
    labelBg: string
    label: string
}

export const blueColor: Theme = {
    bg: 'bg-blue-700 bg-opacity-99',
    text: 'text-violet-100',
    normalIcon: 'fill-violet-100',
    warningIcon: 'text-yellow-500',
    historyIcon: 'fill-violet-100 -left-2 -top-1.5 rotate-45',

    playBg: 'bg-blue-grey',
    play: 'white',
    pause: 'text-white',
    wave: 'rgb(128, 154, 241)',
    progress: 'rgb(213, 221, 250)',
    hoverLine: 'white',
    labelBg: '#94a3b8',
    label: 'white',
}

export const neutralColor: Theme = {
    bg: 'bg-neutral-100 bg-opacity-80 backdrop-blur',
    text: 'text-neutral-800',
    normalIcon: 'fill-neutral-800',
    warningIcon: 'text-yellow-500',
    historyIcon: '-right-2 -top-2 fill-neutral-800 -rotate-45',

    playBg: 'bg-white',
    play: '#5e5e5e',
    pause: 'text-neutral-500',
    wave: '#8c8c8c',
    progress: '#2f2f2f',
    hoverLine: 'black',
    labelBg: '#d1d5db',
    label: 'black',
}
