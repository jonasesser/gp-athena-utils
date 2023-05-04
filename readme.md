# gpUtils

gpUtils is a library for use with the Athena >= 5.1.0 It contains useful functions and utilities for developers creating their Athena Plugin resources.

## Installation

Copy the content of this repository to a new gp-athena-utils folder into your Athena Plugins folder.

## Usage Clientside

```ts
import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api';

export class MyOwnPluginClass {
    static init() {
        //Init your plugin here, as example:

        AthenaClient.systems.hotkeys.add({
            key: KEY_BINDS.MYSPECIALKEY,
            description: 'Do something special',
            identifier: 'myownplugin-specialkey',
            keyDown: MyOwnPluginClass.doSomethingSpecial,
        });
    }

    static async doSomethingSpecial() {
        const gpUtils = await AthenaClient.systems.plugins.useAPI('gputils');
        const vehicle = gpUtils.getClosestVehicle(alt.LocalPlayer.local.pos);
        ...

        //another example serverside:
        const gpUtils = await Athena.systems.plugins.useAPI('gputils');
        gpUtils.emitAll(closestPlayers,...);
    }
}
```

## Documentation

Documentation for each function can be found in the corresponding file in the src directory.

## Support

If you want to report an issue, please use the GitHub Issue Tracker.

## License

This project is licensed under the MIT License.

Thank you for using gpUtils!
