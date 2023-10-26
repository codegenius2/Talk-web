/**
 *  @file highlight-copy.js
 *  @author Arron Hunt <arronjhunt@gmail.com>
 *  @copyright Copyright 2021. All rights reserved.
 */


/**
 * Adds a copy button to highlightjs code blocks
 */
export class CopyButtonPlugin {

    language: string | undefined

    constructor() {
    }

    "before:highlight"({language}: { code: string, language: string | undefined }) {
        this.language = language
    }

    "after:highlightElement"({el, text}: { el: Element, text: string }) {
        if (!el.parentElement) {
            return;
        }
        if (el.parentElement.classList.contains("hljs-copy-wrapper")) {
            return;
        }

        // Create the copy button and append it to the codeblock.
        const button = Object.assign(document.createElement("button"), {
            innerHTML: locales[this.language!]?.[0] ?? "Copy",
            className: "hljs-copy-button",
        });

        button.dataset.copied = 'false';

        el.parentElement.classList.add("hljs-copy-wrapper");
        el.parentElement.appendChild(button);

        // Add a custom proprety to the code block so that the copy button can reference and match its background-color value.
        el.parentElement.style.setProperty(
            "--hljs-theme-background",
            window.getComputedStyle(el).backgroundColor
        );

        const lang = this.language!
        const parentElement = el.parentElement
        button.onclick = function () {
            if (!navigator.clipboard) return;
            navigator.clipboard
                .writeText(text)
                .then(function () {
                    button.innerHTML = locales[lang]?.[1] || "Copied!";
                    button.dataset.copied = 'true';

                    let alert: HTMLDivElement & {
                        role: string;
                        innerHTML: string;
                        className: string
                    } | undefined = Object.assign(document.createElement("div"), {
                        role: "status",
                        className: "hljs-copy-alert",
                        innerHTML: locales[lang]?.[2] || "Copied to clipboard",
                    });

                    parentElement.appendChild(alert);

                    setTimeout(() => {
                        button.innerHTML = locales[lang]?.[0] || "Copy";
                        button.dataset.copied = 'false';
                        if (alert) {
                            parentElement.removeChild(alert);
                        }
                        alert = undefined;
                    }, 2000);
                })
                .then(() => {
                });
        };
    }
}

/**
 * Basic support for localization. Please submit a PR
 * to help add more languages.
 * https://github.com/arronhunt/highlightjs-copy/pulls
 */
const locales: Record<string, string[]> = {
    "en": ["Copy", "Copied!", "Copied to clipboard"],
    "es": ["Copiar", "¡Copiado!", "Copiado al portapapeles"],
    "fr": ["Copier", "Copié !", "Copié dans le presse-papier"],
    "de": ["Kopieren", "Kopiert!", "In die Zwischenablage kopiert"],
    "ja": ["コピー", "コピーしました！", "クリップボードにコピーしました"],
    "ko": ["복사", "복사됨!", "클립보드에 복사됨"],
    "ru": ["Копировать", "Скопировано!", "Скопировано в буфер обмена"],
    "zh": ["复制", "已复制!", "已复制到剪贴板"],
    "zh-tw": ["複製", "已複製!", "已複製到剪貼簿"],
}