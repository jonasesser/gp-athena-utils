import { Player } from 'alt-server';
import * as Athena from '@AthenaServer/api';
import * as charRef from '@AthenaShared/interfaces/character';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';

/**
 * @deprecated replace data
 */
declare module 'alt-server' {
    export interface Player {
        /**
         * @deprecated:
         * Use Athena.document.character.get instead!
         * This is a temporary fix. Each call will execute Athena.document.character.get in background.
         *
         * Alternatively you can use Player.character to get a NOT up to date copy of the character. (Maybe better in performace)
         */
        data: charRef.Character;

        /**
         * This is a temporary fix and data contains a NOT up to date copy of the character after character selection
         * Instead you can use Athena.document.character.get for a up to date character.
         */
        character: charRef.Character;
    }
}

Object.defineProperty(Player.prototype, 'data', {
    get: function (): charRef.Character {
        let data = Athena.document.character.get(this) as charRef.Character;
        return data;
    },
});

export class PlayerExtension {
    static init() {
        Athena.player.events.on('selected-character', PlayerExtension.initPlayer);
    }

    static initPlayer(player: Player) {
        const character = Athena.document.character.get(player);
        player.character = deepCloneObject(character);
    }
}
