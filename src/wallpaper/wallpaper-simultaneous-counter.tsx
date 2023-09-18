// wikiart.org public domain arts, free to use
export function WallpaperSimultaneousCounter() {
    return <div>
        {/* to hide the white edge of blur*/}
        <div
            className="bg-simultaneous-counter-composition-1930 bg-center bg-cover fixed -mt-5 -ml-5
            w-screen-105 h-screen-105 blur-lg brightness-75 -z-50"/>
        <div className="bg-noise opacity-80 fixed h-full w-full contrast-200 brightness-200 -z-50"/>
    </div>
}