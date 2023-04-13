import { onInventoryUpdate } from '@AthenaClient/events/onInventoryUpdate';
import { Item } from '@AthenaShared/interfaces/item';

let inventory: Array<Item> = [];
let toolbar: Array<Item> = [];
let totalWeight: number;

export class InventoryUtil {

    static init(){
        onInventoryUpdate.add(InventoryUtil.onUpdate);
    }

    static onUpdate(_inventory: Array<Item>, _toolbar: Array<Item>, _totalWeight: number) {
        inventory = _inventory;
        toolbar = _toolbar;
        totalWeight = _totalWeight;
    }

    static getInventory(){
        return inventory;
    }

    static getToolbar(){
        return toolbar;
    }

    static getTotalWeight(){
        return totalWeight;
    }
}