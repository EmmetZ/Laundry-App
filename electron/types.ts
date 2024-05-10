export interface PositionInfo {
  id: number;
  state: number;
  address: string;
  name: string;
  positionDeviceDetailList: {
    categoryCode: string;
    categoryName: string;
    total: number;
  }[];
}

export interface Response<T> {
  code: number;
  data: T;
  message: string;
}

export interface Device {
  id: number;
  name: string;
  state: number;
}

export interface DeviceDetail {
  items: Device[]
}

export interface Devices {
  code: string;
  data: Device[]
}

export type FetchCallback = (address: string, device: Devices[]) => void;

export type MesCallBack = (success: boolean, method: FetchType, message: string | object) => void;

export interface StoreType {
  id: number;
  interval: number;
  notification: boolean;
  closeAction: string;
}

export type FetchType = "request" | "refresh";