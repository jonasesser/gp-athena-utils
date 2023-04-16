import * as alt from 'alt-client';
import { getClosestPlayer, getClosestVehicle } from './src/utility/closest';
import { addAPI } from '@AthenaClient/systems/plugins';

declare global {
    export interface ClientPluginAPI {
        ['gputils']: typeof funcs;
    }
}

const funcs = {
    getClosestVehicle,
    getClosestPlayer,
};

addAPI('gputils', funcs);

alt.log(`~ly~Plugin Loaded -- gpAthenaUtils`);
