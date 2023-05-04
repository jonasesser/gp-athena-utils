import { Player } from 'alt-server';
import * as Athena from '@AthenaServer/api';
import * as charRef from '@AthenaShared/interfaces/character';

/**
 * @deprecated replace data
 */
declare module 'alt-server' {
    export interface Player {
        /**
         * @deprecated: Use Athena.document.character.get instead!
         */
        data: charRef.Character;
    }
}

Object.defineProperty(Player.prototype, 'data', {
    get: function (): charRef.Character {
        let data = Athena.document.character.get(this) as charRef.Character;
        return data;
    },
});
