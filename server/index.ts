import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { addAPI } from '@AthenaServer/systems/plugins';
import { getClosestPlayers } from './utility/closest';
import { InventoryUtil } from './utility/inventory';
import { emitAll } from './utility/emitHelper';

const PLUGIN_NAME = 'gpAthenaUtils';

declare global {
    export interface ServerPluginAPI {
        ['gputils']: typeof funcs;
    }
}

const InventoryUtilInstance = new InventoryUtil();
InventoryUtilInstance.init();

const funcs = {
    emitAll,
    getClosestPlayers,
    getToolBarItem: InventoryUtilInstance.getToolBarItem,
    getInventoryItem: InventoryUtilInstance.getInventoryItem,
    getAllInventoryItems: InventoryUtilInstance.getAllInventoryItems,
    getAllToolbarItems: InventoryUtilInstance.getAllToolbarItems,
    dropItem: InventoryUtilInstance.dropItem,
    isInToolbar: InventoryUtilInstance.isInToolbar,
    isInInventory: InventoryUtilInstance.isInInventory,
    createCustomItem: InventoryUtilInstance.createCustomItem,
    addCustomItemToInventory: InventoryUtilInstance.addCustomItemToInventory,
};

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    addAPI('gputils', funcs);
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
