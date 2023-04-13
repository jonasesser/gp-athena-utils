```
async function createAndOpen(player: alt.Player) {
  const id = await Athena.systems.storage.create([]);
  open(player, id);
}

async function open(player: alt.Player, id: string) {
    if (Athena.systems.storage.isOpen(id)) {
        return;
    }

    Athena.systems.storage.setAsOpen(id);
    Athena.systems.storage.closeOnDisconnect(player, id);

    const storedItems = await Athena.systems.storage.get(id);
    InventoryView.storage.open(player, id, storedItems, 256, true);
}

async function closeStorage(uid: string, items: Array<StoredItem>, player: alt.Player) {
    if (!Athena.systems.storage.isOpen(uid)) {
        return;
    }

    await Athena.systems.storage.set(uid, items);
    Athena.systems.storage.removeAsOpen(uid);
}

InventoryView.callbacks.add('close', closeStorage);
```
