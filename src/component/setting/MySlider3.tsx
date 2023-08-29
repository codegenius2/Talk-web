import {useState} from "react";

import {Box, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack} from "@chakra-ui/react";


const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
}
export default function XSlider() {
    const [sliderValue, setSliderValue] = useState(50)
    return (
        <Box pt={6} pb={2}>
            <Slider aria-label='slider-ex-6'
                    defaultValue={10} min={0} max={100} step={10} isReversed={true}
                    onChange={(val) => setSliderValue(val)}>
                <SliderMark
                    value={sliderValue}
                    color="rgb(58,65,80)"
                    textAlign='center'
                    mt='-10'
                    ml='-5'
                    w='12'
                >
                    {sliderValue}
                </SliderMark>
                <SliderTrack height="1.6em" borderRadius="0.4em" bgGradient="linear(to-r, #bbf7d0,#bfdbfe, #fbcfe8)">
                    <SliderFilledTrack bg="white"/>
                </SliderTrack>
                <SliderThumb w='0' h='0'/>
            </Slider>
        </Box>
    );
}