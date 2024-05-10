import { create } from "zustand";
import { Devices } from "../electron/types";

type Subscribe = Record<number, boolean>;
type MessageType = "success" | "error" | "info";

interface Store {
  id: number;
  address: string;
  devices: Devices[];
  notification: boolean;
  subscribe: Subscribe;
  isMesOpen: boolean;
  message: string;
  messageType: MessageType;
  setId: (id: number) => void;
  setDevices: (devices: Devices[]) => void;
  setAddress: (address: string) => void;
  setNotification: (f: boolean) => void;
  initSubscribe: (devices: Devices[]) => void;
  updateSubscribe: (id: number, flag: boolean) => void;
  setMessage: (message: string) => void;
  setMesOpen: (f: boolean) => void;
  setMessageType: (type: MessageType) => void;
}

const useStore = create<Store>((set) => ({
  id: -1,
  address: "",
  devices: [] as Devices[],
  notification: true,
  subscribe: {},
  message: "",
  isMesOpen: false,
  messageType: "info",
  setId: (id: number) => set({ id, devices: [] as Devices[], subscribe: {} }),
  setDevices: (devices: Devices[]) =>
    set((state) => {
      if (state.devices.length === 0) {
        state.initSubscribe(devices);
      }
      return { devices };
    }),
  setAddress: (address: string) => set({ address }),
  setNotification: (f) => set({ notification: f }),
  initSubscribe: (devices) =>
    set(() => {
      if (devices.length === 0) return { devices };
      let s: Subscribe = {};
      devices.map((item) => {
        item.data.map((device) => {
          s[device.id] = false;
        });
      });
      return { subscribe: s };
    }),
  updateSubscribe: (id, flag) =>
    set(({ subscribe }) => {
      let s = subscribe;
      s[id] = flag;
      return { subscribe: s };
    }),
  setMessage: (message) => set({ message }),
  setMesOpen: (f) => set({ isMesOpen: f }),
  setMessageType: (type) => set({ messageType: type }),
}));

export default useStore;
