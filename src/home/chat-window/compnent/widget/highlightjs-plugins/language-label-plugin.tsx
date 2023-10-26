/**
 * Adds a language label to highlightjs code blocks
 */
export class LanguageLabelPlugin {

    language: string | undefined

    constructor() {
    }

    "before:highlight"({language}: { code: string, language: string | undefined }) {
        this.language = language
    }

    "after:highlightElement"({el}: { el: Element, text: string }) {
        if (!this.language || el.classList.contains("language-label-added")) {
            return;
        }
        el.classList.add("language-label-added")
        const label = Object.assign(document.createElement("label"), {
            innerHTML: this.language,
            className: "language-label hljs-string absolute top-0 right-1 opacity-50",
        });
        el.parentElement!.appendChild(label);
    }
}