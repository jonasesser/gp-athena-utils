import * as alt from 'alt-client';
import { getClosestPlayer, getClosestVehicle } from './src/utility/closest';

declare global {
    export interface ClientPluginAPI {
        ['gpUtils']: typeof funcs;
    }
}

const funcs = {
    getClosestVehicle,
    getClosestPlayer,
};

alt.log(`~ly~Plugin Loaded -- gpAthenaUtils`);
