import {devtools} from "valtio/utils";
import {appState, hydrationState} from "./app-state.ts";
import {controlState} from "./control-state.ts";
import {networkState} from "./network-state.ts";

devtools(appState, {name: 'appState', enabled: true})
devtools(hydrationState, {name: 'hydrationState', enabled: true})
devtools(controlState, {name: 'controlState', enabled: true})
devtools(networkState, {name: 'controlState', enabled: true})
