/**
 *  @file highlight-copy.js
 *  @author Arron Hunt <arronjhunt@gmail.com>
 *  @copyright Copyright 2021. All rights reserved.
 */


/**
 * Adds a copy button to highlightjs code blocks
 */
export class CopyButtonPlugin {


    "after:highlightElement"({el, text}: { el: Element, text: string }) {
        if (!el.parentElement) {
            return;
        }
        if (el.parentElement.classList.contains("hljs-copy-wrapper")) {
            return;
        }

        // Create the copy button and append it to the codeblock.
        const button = Object.assign(document.createElement("button"), {
            innerHTML: "Copy",
            className: "hljs-copy-button px-2 select-none",
        });

        button.dataset.copied = 'false';

        el.parentElement.classList.add("hljs-copy-wrapper");
        el.parentElement.appendChild(button);

        // Add a custom proprety to the code block so that the copy button can reference and match its background-color value.
        el.parentElement.style.setProperty(
            "--hljs-theme-background",
            window.getComputedStyle(el).backgroundColor
        );

        const parentElement = el.parentElement
        button.onclick = function () {
            if (!navigator.clipboard) return;
            navigator.clipboard
                .writeText(text)
                .then(function () {
                    button.innerHTML = "Copied!";
                    button.dataset.copied = 'true';

                    let alert: HTMLDivElement & {
                        role: string;
                        innerHTML: string;
                        className: string
                    } | undefined = Object.assign(document.createElement("div"), {
                        role: "status",
                        className: "hljs-copy-alert",
                        innerHTML: "Copied to clipboard",
                    });

                    parentElement.appendChild(alert);

                    setTimeout(() => {
                        button.innerHTML = "Copy";
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