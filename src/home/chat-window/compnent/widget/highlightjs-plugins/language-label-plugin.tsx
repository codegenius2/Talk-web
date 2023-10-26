import hljs, {HighlightResult} from "highlight.js";

/**
 * Adds a language label to highlightjs code blocks
 */
export class LanguageLabelPlugin {

    constructor() {
    }

    "after:highlightElement"({el, result}: { el: Element, result: HighlightResult }) {
        if (!el.parentElement) {
            return;
        }

        if (!result.language || el.parentElement.classList.contains("lang-label-added")) {
            return;
        }

        let langeName = result.language
        if(result.language){
            langeName = hljs.getLanguage(result.language)?.name ?? result.language
        }

        el.parentElement.classList.add("lang-label-added")
        const label = Object.assign(document.createElement("label"), {
            innerHTML: langeName,
                className: "language-label hljs-string select-none absolute top-1 right-1 opacity-70 text-xs",
        });
        el.parentElement!.appendChild(label);
    }
}