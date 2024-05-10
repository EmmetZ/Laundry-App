import path from "node:path";
import { ipcMain } from "electron";
import Store from "electron-store";
import { StoreType } from "../types";

function initIpcMain(store: Store<StoreType>) {
  // The internal ipcMain module is initialized lazily, so we need to require it
  // here to ensure that it is initialized before we start using it.
  ipcMain.handle("get-id", async () => {
    return store.get("id");
  });

  ipcMain.handle("get-notification", async () => {
    return store.get("notification");
  });

  ipcMain.on("set-notification", (e, value) => {
    store.set("notification", value);
  });

  ipcMain.handle("get-icon", async () => {
    return path.join(process.env.VITE_PUBLIC, "icon.png");
  })

  ipcMain.handle("get-interval", async () => {
    return store.get("interval");
  });

  ipcMain.handle("get-close-action", async () => {
    return store.get("closeAction");
  });
}

export default initIpcMain;