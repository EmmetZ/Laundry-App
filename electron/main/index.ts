import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDevices, getPosInfo } from "./api";
import Store from "electron-store";
import Timer from "./timer";
import { FetchType, StoreType } from "../types";
import initIpcMain from "./ipcMain";

// const require = createRequire(import.meta.url);
app.setName("Laundry App");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

const store = new Store<StoreType>();

const TRAY_ICON_PATH = path.join(process.env.VITE_PUBLIC, "icon.png");
let win: BrowserWindow | null;
let tray;
let timer: Timer | null = null;

if (!store.has("id")) store.set("id", -1);
let id: number = store.get("id");
// let id: number | undefined = 27046;

let interval: number = store.get("interval") || 3;
store.set("interval", interval);
if (!store.has("notification")) store.set("notification", true);

if (!store.has("closeAction")) store.set("closeAction", "quit");
let closeAction = store.get("closeAction");

function createTray() {
  const trayIcon = nativeImage.createFromPath(TRAY_ICON_PATH);
  tray = new Tray(trayIcon);
  tray.setToolTip("Laundry App");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "quit",
      click: () => {
        if (win) win.destroy();
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    win?.show();
  });
}

async function request() {
  async function onFinish(id: number | undefined, type: FetchType = "request") {
    if (id === undefined || id === -1) return;
    try {
      const { address, codeList } = await getPosInfo(id);
      const devices = await getDevices(id, codeList);
      win?.webContents.send("data", address, devices);
      win?.webContents.send("message", true, type, "请求成功");
    } catch (e) {
      console.log("error");
      if (e instanceof Error)
        win?.webContents.send("message", false, type, e.message);
    }
    console.log("request");
  }

  timer = new Timer(interval * 60, (type: FetchType) => onFinish(id, type));
  if (id && id !== -1) timer.start();
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    width: 850,
    height: 600,
  });

  // Test active push message to Renderer-process.

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // win.loadFile(path.join(RENDERER_DIST, "index.html"));

  win.setMenuBarVisibility(false);
  // if (process.env.NODE_ENV === "development") win.webContents.openDevTools();

  createTray();

  ipcMain.once("ready", () => {
    request();
  });

  ipcMain.on("update-id", (e, newId) => {
    id = newId;
    store.set("id", id);
    if (id === -1) return;
    if (timer) timer.start();
    else request();
  });

  ipcMain.on("set-interval", (e, value) => {
    store.set("interval", value);
    if (timer) timer.interval = value;
    interval = value;
  });

  ipcMain.on("refresh-data", () => {
    if (timer) timer.reset(true, "refresh");
  });

  ipcMain.on("set-close-action", (e, value) => {
    store.set("closeAction", value);
    closeAction = value;
  });

  initIpcMain(store);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  win?.on("close", (event) => {
    event.preventDefault();
    if (closeAction === "quit") {
      if (win) win.destroy();
      app.quit();
    } else win?.hide();
  });
});
