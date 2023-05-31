import { View_Events_Input_Menu } from '@AthenaPlugins/gp-athena-utils/shared/events';
import { InputMenu } from '@AthenaPlugins/gp-athena-utils/shared/interfaces/inputMenus';
import * as alt from 'alt-server';

export class MenuUtil {
    public init() {}

    public inputMenu(player: alt.Player, inputMenu: InputMenu) {
        alt.emitClient(player, View_Events_Input_Menu.SetMenu, inputMenu);
    }
}
