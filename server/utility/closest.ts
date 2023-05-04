import { getClosestTypes } from '@AthenaShared/utility/vector';
import * as alt from 'alt-server';

/**
 * Gets the closest players in reference to the passed player.
 *
 *
 * @param {alt.Player} p
 * @param {number} distance
 * @return {Array<alt.Player>}
 */
export function getClosestPlayers(p: alt.Player, distance: number): Array<alt.Player> {
    const players = [...alt.Player.all];
    return getClosestTypes<alt.Player>(p.pos, players, distance, ['data', 'discord', 'accountData']);
}
