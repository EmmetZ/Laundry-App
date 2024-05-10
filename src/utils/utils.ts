import { Devices } from "../../electron/types";

type Message<T> = { name: string; state: T; code: string };

export const getDeviceObj = (devices: Devices[]) => {
  let l: Record<number, Message<number>> = {};
  devices.forEach((item) => {
    item.data.forEach((device) => {
      l[device.id] = {
        name: device.name,
        state: device.state,
        code: item.code,
      };
    });
  });
  return l;
};
