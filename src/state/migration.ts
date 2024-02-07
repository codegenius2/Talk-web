import {AppState} from "./app-state.ts"
import * as packageJson from '../../package.json'
import {defaultOption} from "../data-structure/client-option.tsx"
import {defaultShortcuts, KeyCombo, Shortcuts} from "./shortcuts.ts";
import semver from "semver/preload";

const currentVersion = packageJson.version

type Step = {
    fromVersion: string
    toVersion: string
    action: (app: AppState) => Error | null
}

const steps: Step[] = [
    {
        fromVersion: "0.0.0",
        toVersion: "0.0.1",
        action: (): Error | null => {
            return null
        }
    },
    {
        fromVersion: "0.0.1",
        toVersion: "0.0.2",
        action: (_app: AppState): Error | null => {
            _app.option.stt.google = defaultOption().tts.google
            for (const chat of _app.chats) {
                chat.option.tts.google = defaultOption().tts.google
            }
            return null
        }
    },
    {
        fromVersion: "0.0.2",
        toVersion: "0.0.3",
        action: (_app: AppState): Error | null => {
            _app.pref.wallpaper = {index: 0}
            return null
        }
    },
    {
        fromVersion: "0.0.3",
        toVersion: "1.1.0",
        action: (app: AppState): Error | null => {
            for (const chat of app.chats) {
                chat.promptId = ""
                chat.option.llm.maxAttached = defaultOption().llm.maxAttached
            }
            app.option.llm.maxAttached = defaultOption().llm.maxAttached
            return null
        }
    },
    {
        fromVersion: "1.1.0",
        toVersion: "1.2.8",
        action: (app: AppState): Error | null => {
            app.pref.dismissDemo = false
            return null
        }
    },
    {
        fromVersion: "1.2.8",
        toVersion: "1.3.0",
        action: (app: AppState): Error | null => {
            app.pref.showRecorder = true
            app.pref.shortcuts = defaultShortcuts()
            return null
        }
    },
    {
        fromVersion: "1.3.0",
        toVersion: "2.0.0",
        action: (app: AppState): Error | null => {
            app.pref.showMarkdown = true
            app.option.llm.gemini = defaultOption().llm.gemini
            for (const chat of app.chats) {
                chat.option.llm.gemini = defaultOption().llm.gemini
            }
            return null
        }
    },
    {
        fromVersion: "2.0.0",
        toVersion: "2.0.3",
        action: (app: AppState): Error | null => {
            const dft = defaultShortcuts()
            Object.keys(app.pref.shortcuts).forEach((field) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const shortcut = dft[field] as KeyCombo|undefined
                if (!shortcut){
                    return Error(`${field} was not found in defaultShortcuts`)
                }
                app.pref.shortcuts[field as keyof Shortcuts].name = shortcut.name
            })
            return null
        }
    }
]

export const migrateAppState = (app: AppState): Error | null => {
    if (app.version === currentVersion) {
        return null
    }
    if (!app.version) {
        app.version = steps[0].fromVersion
    }

    for (const step of steps) {
        if (semver.gte(app.version, step.fromVersion) && semver.lt(app.version, step.toVersion)) {
            console.info(`migrating from ${step.fromVersion} to ${step.toVersion}`)
            const error = step.action(app)
            if (error) {
                console.error("fatal error, failed to migrate to new version")
                console.error(`from ${step.fromVersion} to ${step.toVersion}`)
                console.error("appState:", app)
                return error
            }
            app.version = step.toVersion
        }
    }
    return null
}