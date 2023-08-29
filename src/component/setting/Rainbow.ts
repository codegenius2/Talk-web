const colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
]

const totalColors = 17

// density:50,100,200~900,950
export function rainbowBg( count: number,density: number): string[] {
    return rainbowColors( count,density,'bg-')
}

// density:50,100,200~900,950
export function rainbowText(count: number,density: number): string[] {
    return rainbowColors( count,density,'text-')
}

// density:50,100,200~900,950
function rainbowColors(count: number, density: number, prefix?: string): string[] {
    const res = []
    for (let i = 0; i < count; i++) {
        const c = `${prefix??""}${colors[i % totalColors]}-${density}`
        res.push(c)
    }
    return res
}