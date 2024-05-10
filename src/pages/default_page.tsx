import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Devices, FetchCallback, MesCallBack } from "../../electron/types";
// import deviceData from "../../test/devices.json";
// import deviceData1 from "../../test/devices1.json";
import Message from "../components/message";
import SideBar from "../components/sidebar";
import useStore from "../store";
import { CATEGORYCODE, STATE } from "../utils/constant";
import { getDeviceObj } from "../utils/utils";

let ICON_PATH: string; 
const DefaultPage = () => {
  const {
    setAddress,
    setDevices,
    devices,
    subscribe,
    notification,
    setId,
    setNotification,
    setMessage,
    setMesOpen,
    setMessageType,
  } = useStore();
  const subscribeRef = useRef(subscribe);
  const devicesRef = useRef(devices);

  useEffect(() => {
    subscribeRef.current = subscribe;
  }, [subscribe]);

  useEffect(() => {
    devicesRef.current = devices;
  }, [devices]);

  useEffect(() => {
    window.store.getId().then((id) => {
      if (id) setId(id);
    });
    window.store.getNotification().then((notification) => {
      if (notification) setNotification(notification);
    });
    const fetchIcon = async () => {
      ICON_PATH = await window.data.getIcon();
    };
    fetchIcon();
  }, []);

  // useEffect(() => {
  //   setDevices(deviceData);
  // }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     console.log("set devices");
  //     checkState(deviceData1);
  //     setDevices(deviceData1);
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, []);

  const checkState = (newDevices: Devices[]) => {
    const subscribe = subscribeRef.current;
    const next = getDeviceObj(newDevices);
    const prev = getDeviceObj(devicesRef.current);

    let message = "";
    const deviceId = Object.keys(subscribe).filter(
      (id) => subscribe[parseInt(id)] === true
    );
    // console.log(deviceId);
    deviceId.forEach((id) => {
      const intId = parseInt(id);
      if (next[intId].state !== prev[intId].state) {
        message += `\n${CATEGORYCODE[next[intId].code]}: ${next[intId].name} ${
          STATE[next[intId].state]
        }`;
      }
    });
    if (message && notification)
      new Notification("Landry App: 设备状态改变!", {
        body: message,
        icon: ICON_PATH,
      });
  };

  const fetchCallback: FetchCallback = (address, devices) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    console.log(`${hours}:${minutes}:${seconds}`);
    if (Object.values(subscribeRef.current).includes(true)) checkState(devices);
    setAddress(address);
    setDevices(devices);
  };

  const mesCallback: MesCallBack = (success, method, message) => {
    if (success) {
      if (method === "refresh") {
        console.log("refresh success");
        setMesOpen(true);
        setMessage("刷新成功");
        setMessageType("success");
      }
    } else {
      setMesOpen(true);
      setMessage(`获取失败: ${message}`);
      setMessageType("error");
    }
  };

  useEffect(() => window.data.ready(), []);

  useEffect(() => {
    window.data.listen(fetchCallback);
    return () => window.data.removeDataListener();
  }, []);

  useEffect(() => {
    window.data.message(mesCallback);
    return () => window.data.removeMesListener();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          padding: 2,
        }}
      >
        <Outlet />
      </Box>
      <Message />
    </Box>
  );
};

export default DefaultPage;
