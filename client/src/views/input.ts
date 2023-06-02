import * as AthenaClient from '@AthenaClient/api';
import ViewModel from '@AthenaClient/models/viewModel';
import { View_Events_Input_Menu } from '@AthenaPlugins/gp-athena-utils/shared/events';
import { InputMenu, InputResult } from '@AthenaPlugins/gp-athena-utils/shared/interfaces/inputMenus';
import * as alt from 'alt-client';

//TODO: Old v4.x style. Needs to be updated to v5.x style.

const PAGE_NAME = View_Events_Input_Menu.InputBoxPageName;
let inputMenu: InputMenu;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static async show(_inputMenu: InputMenu): Promise<void> {
        inputMenu = _inputMenu;

        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        // Need to add a sleep here because wheel menu inputs can be be too quick.
        await alt.Utils.wait(150);

        AthenaClient.webview.ready(PAGE_NAME, InternalFunctions.ready);
        AthenaClient.webview.on(View_Events_Input_Menu.Submit, InternalFunctions.submit);

        AthenaClient.webview.openPages(PAGE_NAME, true, InternalFunctions.onEscape);
        AthenaClient.webview.focus();
        AthenaClient.webview.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        AthenaClient.webview.closePages([PAGE_NAME], true);
        InternalFunctions.onClose();
    }

    static async onClose() {
        AthenaClient.webview.unfocus();
        AthenaClient.webview.showCursor(false);
        alt.toggleGameControls(true);
        alt.Player.local.isMenuOpen = false;
    }

    static async onEscape() {
        InternalFunctions.onClose();

        if (inputMenu.callback) {
            inputMenu.callback(null);
        }

        if (inputMenu.serverEvent) {
            alt.emitServer(inputMenu.serverEvent, null);
        }
    }

    static submit(results: InputResult[]) {
        if (inputMenu.callback) {
            inputMenu.callback(results);
        }

        if (inputMenu.serverEvent) {
            alt.emitServer(inputMenu.serverEvent, results);
        }

        InternalFunctions.close();
    }

    static async ready() {
        AthenaClient.webview.emit(
            View_Events_Input_Menu.SetMenu,
            inputMenu.title,
            inputMenu.options,
            inputMenu.generalOptions,
        );
    }
}

export class InputView {
    /**
     * Show an input menu from client-side.
     * @static
     * @param {InputMenu} _inputMenu
     * @memberof InputView
     */
    static setMenu(_inputMenu: InputMenu) {
        InternalFunctions.show(_inputMenu);
    }
}

alt.onServer(View_Events_Input_Menu.SetMenu, InternalFunctions.show);
