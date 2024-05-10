import { contextBridge, ipcRenderer } from "electron";
import { FetchCallback, MesCallBack } from "./types";

contextBridge.exposeInMainWorld("data", {
  listen: (callback: FetchCallback) =>
    ipcRenderer.on("data", (event, address, devices) =>
      callback(address, devices)
    ),
  ready: () => ipcRenderer.send("ready"),
  removeDataListener: () => ipcRenderer.removeAllListeners("data"),
  refresh: () => ipcRenderer.send("refresh-data"),
  message: (callback: MesCallBack) =>
    ipcRenderer.on("message", (e, success, method, message) =>
      callback(success, method, message)
    ),
  removeMesListener: () => ipcRenderer.removeAllListeners("message"),
  getIcon: () => ipcRenderer.invoke("get-icon")
});

contextBridge.exposeInMainWorld("store", {
  updateId: (id: number) => ipcRenderer.send("update-id", id),
  getId: () => ipcRenderer.invoke("get-id"),
  getNotification: () => ipcRenderer.invoke("get-notification"),
  setNotification: (notification: boolean) =>
    ipcRenderer.send("set-notification", notification),
  setInterval: (interval: number) => ipcRenderer.send("set-interval", interval),
  getInterval: () => ipcRenderer.invoke("get-interval"),
  setCloseAction: (action: string) =>
    ipcRenderer.send("set-close-action", action),
  getCloseAction: () => ipcRenderer.invoke("get-close-action"),
});
