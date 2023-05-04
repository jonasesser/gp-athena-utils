import { BaseItemEx, Item, StoredItem } from '@AthenaShared/interfaces/item';
import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { InventoryType } from '@AthenaPlugins/core-inventory/shared/interfaces';
import { ItemUtil } from './itemUtil';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';

/**
 *
 */
export class InventoryUtil {
    public init() {}

    /**
     * Example Function to add item with custom data to inventory.
     * @param player E
     * @param item
     * @param amount
     * @returns
     */
    public async addCustomItemToInventory<CustomData>(
        player: alt.Player,
        item: BaseItemEx<CustomData>,
        amount: number = 1,
    ): Promise<boolean> {
        const storedItem = Athena.systems.inventory.convert.toStoredItem<CustomData>(item, amount);
        const isAdded = await Athena.player.inventory.add(player, storedItem);
        return isAdded;
    }

    public async createCustomItem<CustomData>(
        item: Partial<BaseItemEx<CustomData>>,
    ): Promise<BaseItemEx<CustomData> | null> {
        const itemFromDB = await Athena.systems.inventory.factory.getBaseItemAsync(item.dbName);

        if (!itemFromDB) {
            return null;
        }
        const newItem = ItemUtil.deepTransferObject<BaseItemEx<CustomData>>(itemFromDB, item);
        return newItem;
    }

    public getToolBarItem(player: alt.Player, item: Partial<Item>): Item | null {
        return this.getItemIn(player, item, 'toolbar');
    }

    public getInventoryItem(player: alt.Player, item: Partial<Item>): Item | null {
        return this.getItemIn(player, item, 'inventory');
    }

    /**
     * Checks if an item is in the toolbar data section.
     * Returns the index of the toolbar if it's present.
     * Returns null if the slot is empty.
     * @param {alt.Player} playerRef
     * @param {Partial<Item>} item
     * @return {{ index: number } | null}
     * @memberof InventoryPrototype
     */
    public isInToolbar(playerRef: alt.Player, item: Partial<Item>): { index: number } | null {
        return this.isItemIn(playerRef, item, 'toolbar');
    }

    /**
     * Checks if an item is in the inventory data section.
     * Returns the tab in the inventory where it is.
     * Returns the index in the array of where this item is.
     * @param {INVENTORY_TYPE} type
     * @param {string} uuid
     * @return { { index: number}  | null }
     * @memberof InventoryPrototype
     */
    public isInInventory(player: alt.Player, item: Partial<Item>): { index: number } | null {
        return this.isItemIn(player, item, 'inventory');
    }

    public getItemIn(player: alt.Player, item: Partial<Item>, type: InventoryType): Item | null {
        const data = Athena.document.character.get(player);

        for (let i = 0; i < data[type].length; i++) {
            const foundItem = data[type][i];
            if (!foundItem) {
                continue;
            }

            const objectKeys = Object.keys(item);
            const keyIndex = objectKeys.findIndex((key: string) => {
                if (item.hasOwnProperty(key) && item[key as keyof Item] === foundItem[key as keyof Item]) {
                    return true;
                }
                return false;
            });

            if (keyIndex <= -1) {
                continue;
            }

            return foundItem;
        }

        return null;
    }

    public isItemIn(player: alt.Player, item: Partial<Item>, type: InventoryType): { index: number } | null {
        const data = Athena.document.character.get(player);

        for (let i = 0; i < data[type].length; i++) {
            const foundItem = data[type][i];
            if (!foundItem) {
                continue;
            }

            const objectKeys = Object.keys(item);
            const keyIndex = objectKeys.findIndex((key: string) => {
                if (item.hasOwnProperty(key) && item[key as keyof Item] === foundItem[key as keyof Item]) {
                    return true;
                }
                return false;
            });

            if (keyIndex <= -1) {
                continue;
            }

            return { index: i };
        }

        return null;
    }

    public async getAllInventoryItems(player: alt.Player): Promise<Array<StoredItem>> {
        const data = Athena.document.character.get(player);
        return data.inventory;
    }

    public async getAllToolbarItems(player: alt.Player): Promise<Array<StoredItem>> {
        const data = Athena.document.character.get(player);
        return data.toolbar;
    }

    public async dropItem(player: alt.Player, type: InventoryType, slot: number) {
        if (type === 'custom') {
            return;
        }

        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined' || typeof data[type] === 'undefined') {
            return;
        }

        const clonedItem = deepCloneObject<StoredItem>(Athena.systems.inventory.slot.getAt(slot, data[type]));
        const baseItem = Athena.systems.inventory.factory.getBaseItem(clonedItem.dbName, clonedItem.version);
        if (typeof baseItem === 'undefined') {
            return;
        }

        if (!baseItem.behavior.canDrop) {
            return;
        }

        if (baseItem.behavior.destroyOnDrop) {
            Athena.player.emit.notification(player, `${baseItem.name} was destroyed on drop.`);
            return;
        }

        const newDataSet = Athena.systems.inventory.slot.removeAt(slot, data[type]);
        if (typeof newDataSet === 'undefined') {
            return;
        }

        await Athena.document.character.set(player, type, newDataSet);
        await Athena.systems.inventory.drops.add(
            clonedItem,
            new alt.Vector3(player.pos.x, player.pos.y, player.pos.z - 1),
            player,
        );
    }
}
