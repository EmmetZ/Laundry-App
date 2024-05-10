import axios from "axios";
import { DeviceDetail, Devices, PositionInfo, Response } from "../types";

const client = axios.create({
  baseURL: "https://yshz-user.haier-ioc.com",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.47(0x18002f28) NetType/WIFI Language/en",
  },
});

export function getPosInfo(posId: number) {
  return client
    .get<Response<PositionInfo>>("position/positionDetail", {
      params: {
        id: posId,
      },
    })
    .then((res) => res.data)
    .then((res) => {
      const data = res.data;
      const address = data.name;
      let codeList: string[] = [];
      data.positionDeviceDetailList.map((item) => {
        codeList.push(item.categoryCode);
      });
      return { address, codeList };
    })
    .catch((e: Error) => {
      throw e;
    });
}

function getDeviceDetail(positionId: number, categoryCode: string) {
  return client
    .post<Response<DeviceDetail>>("/position/deviceDetailPage", {
      positionId,
      categoryCode,
      page: 1,
      pageSize: 100,
    })
    .then((res) => res.data)
    .then((res) => res.data)
    .catch((e: Error) => {
      throw e;
    });
}

export async function getDevices(
  posId: number,
  categoryCodes = ["00"]
): Promise<Devices[]> {
  let promise = categoryCodes.map((code) => {
    return getDeviceDetail(posId, code)
      .then((res) => {
        return { code, data: res.items };
      })
      .catch((e: Error) => {
        throw e;
      });
  });
  return await Promise.all(promise);
}
