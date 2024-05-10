import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import DeviceCard from "../components/device_card";
import useStore from "../store";
import { CATEGORYCODE } from "../utils/constant";

const DevicePage = () => {
  const { address, devices, id, setMessageType, setMesOpen, setMessage } = useStore();
  const navigate = useNavigate();

  const handleClick = () => {
    window.data.refresh();
    setMessage("刷新中.....");
    setMessageType("info");
    setMesOpen(true);
  };

  if (id === -1)
    return (
      <>
        <Typography variant="h5">请先设置楼栋id</Typography>
        <Button onClick={() => navigate("/setting")}>前往设置</Button>
      </>
    );
  if (devices.length === 0)
    return (
      <Container
        sx={{
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  return (
    <>
      <Typography variant="h5" sx={{ mb: "10px" }}>
        {address}
      </Typography>
      <Tooltip title="刷新" sx={{
        position: "fixed",
        right: "20px",
        top: "20px",
      }}>
        <IconButton onClick={handleClick}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      {devices.map((item, index) => {
        return (
          <Fragment key={item.code}>
            {index !== 0 && <Divider sx={{ marginY: "10px" }} />}
            <Typography variant="h6">{CATEGORYCODE[item.code]}</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {item.data.map((device) => {
                return <DeviceCard key={device.id} device={device} />;
              })}
            </Box>
          </Fragment>
        );
      })}
    </>
  );
};

export default DevicePage;
