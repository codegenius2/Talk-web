export const Experiment = () => {
    return (
        <div>
            <div
                className="fixed flex justify-start items-center h-screen w-screen bg-simultaneous-counter-composition-1930 bg-cover blur-lg -z-50 ">
            </div>
            <div className="h-full w-1/4">
                <p className="text-black text-9xl"></p>
            </div>
            <div className="relative h-10 w-64 rounded-full  overflow-hidden z-10">
                <div className=" bg-slider-blue bg-cover h-full w-full  brightness-75 z-10 text-9xl"></div>
                <div
                    className="absolute top-0 left-0 bg-noise-lg opacity-80 h-full w-full contrast-200 brightness-200 z-10"/>
            </div>
            <div className="relative h-10 w-64 rounded-full overflow-hidden">
                <div className=" bg-slider-pink h-full w-full brightness-75"/>
                <div
                    className="absolute bg-cover top-0 left-0 bg-noise-lg opacity-85 h-full w-full contrast-200 brightness-200"/>
            </div>
            <div className="relative flex justify-end h-8 w-64 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-1/2 self-start"/>
                <div className="absolute transform right-1/2 top-1/2 -translate-y-1/2
                bg-noise opacity-100 h-screen w-screen scale-25 bg-cover contrast-200 brightness-200">
                </div>
                <div className="absolute transform left-1/2 top-1/2 -translate-y-1/2
                bg-noise-lg opacity-100 h-full w-full scale-25 bg-cover contrast-200 brightness-200">
                </div>
            </div>
        </div>
    )
}