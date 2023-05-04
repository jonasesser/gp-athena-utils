import { onInventoryUpdate } from '@AthenaClient/events/onInventoryUpdate';
import { Item } from '@AthenaShared/interfaces/item';

let inventory: Array<Item> = [];
let toolbar: Array<Item> = [];
let totalWeight: number;

/**
 * @depricated No used.
 */
export class InventoryUtil {
    public init() {
        onInventoryUpdate.add(InventoryUtil.onUpdate);
    }

    static onUpdate(_inventory: Array<Item>, _toolbar: Array<Item>, _totalWeight: number) {
        inventory = _inventory;
        toolbar = _toolbar;
        totalWeight = _totalWeight;
    }

    public getInventory() {
        return inventory;
    }

    public getToolbar() {
        return toolbar;
    }

    public getTotalWeight() {
        return totalWeight;
    }
}
