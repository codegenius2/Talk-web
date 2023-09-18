import {AppState} from "./app-state.ts";
import * as packageJson from '../../package.json';

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        action: (_app: AppState): Error | null => {
            return null
        }
    }
]

export const migrate = (app: AppState): Error | null => {
    if (app.version === currentVersion) {
        return null
    }
    if (!app.version) {
        app.version = steps[0].fromVersion
    }

    for (const step of steps) {
        if (app.version === step.fromVersion) {
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