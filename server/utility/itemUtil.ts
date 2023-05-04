import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { ItemEx } from '@AthenaShared/interfaces/item';
import { Character } from '@AthenaShared/interfaces/character';
import { InventoryType } from '@AthenaPlugins/core-inventory/shared/interfaces';

export class ItemUtil {
    static getItem<CustomData>(player: alt.Player, slot: number, type: InventoryType): ItemEx<CustomData> {
        let item: ItemEx<CustomData> =
            type === 'toolbar'
                ? Athena.systems.inventory.convert.toItem<CustomData>(Athena.player.toolbar.getAt(player, slot))
                : Athena.systems.inventory.convert.toItem<CustomData>(Athena.player.inventory.getAt(player, slot));
        return item;
    }

    static getPlayerData(player: alt.Player): Character {
        let data = Athena.document.character.get(player);
        return data;
    }

    static deepTransferObject<T>(target: object, source: object): T {
        const target_json = JSON.parse(JSON.stringify(target));
        const source_json = JSON.parse(JSON.stringify(source));

        Object.keys(source_json).forEach((key) => {
            if (target_json[key] === undefined) {
                target_json[key] = source_json[key];
            }
        });

        //Copy Missing Data properties
        if (target_json.data === undefined) {
            target_json.data = source_json.data;
        } else {
            Object.keys(source_json.data).forEach((key) => {
                if (target_json.data[key] === undefined) {
                    target_json.data[key] = source_json.data[key];
                }
            });
        }

        return target_json;
    }
}
