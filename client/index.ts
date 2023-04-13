import * as alt from 'alt-client';
import { InventoryUtil } from './src/inventoryUtil';
import './src/gpUtilsClient';
import { getClosestPlayer, getClosestVehicle } from './src/utility/closest';

//Not needed anymore
// InventoryUtil.init();

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
