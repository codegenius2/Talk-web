import {googleSTTLanguageSettings} from "./google-sst-language.ts"

// see https://www.gstatic.com/cloud-site-ux/text_to_speech/text_to_speech.min.js
// after comparing line by line, we found that googleSTTLanguageSettings and googleTTSLanguageStrings are identical
// at the moment(2023-09-11 10:33:52 Mon)
export const googleTTSLanguageStrings = googleSTTLanguageSettings