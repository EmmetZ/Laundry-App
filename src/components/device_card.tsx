import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { Device } from "../../electron/types";
import useStore from "../store";
import { STATE, TAGCOLOR } from "../utils/constant";
import Tag from "./tag";

interface Props {
  device: Device;
}

const DeviceCard = ({ device }: Props) => {
  const [ring, setRing] = useState<"subscribe" | "unsubscribe" | "init">(
    "init"
  );
  const s = useStore((state) => state.subscribe);
  const updateSubscribe = useStore((state) => state.updateSubscribe);
  const notification = useStore((state) => state.notification);
  const [NotificationIcon, setNotificationIcon] =
    useState<JSX.Element | null>();

  useEffect(() => {
    if (ring === "init") setRing(s[device.id] ? "subscribe" : "unsubscribe");
  }, [device]);

  useEffect(() => {
    if (notification)
      setNotificationIcon(
        ring === "subscribe" ? (
          <NotificationsActiveIcon color="warning" />
        ) : (
          <NotificationsNoneOutlinedIcon />
        )
      );
    else setNotificationIcon(null);
  }, [notification, ring]);

  return (
    <Card
      sx={{
        margin: "5px",
        borderRadius: "10px",
        borderColor: grey[800],
        width: "160px",
      }}
      variant="outlined"
    >
      <CardContent
        sx={{
          "&.MuiCardContent-root": {
            padding: "10px 16px 16px 16px",
          },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "start", justifyContent: "space-between" }}
        >
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ marginBottom: "10px" }}
          >
            <strong>{device.name}</strong>
          </Typography>
          <IconButton
            sx={{ padding: "2px" }}
            onClick={() => {
              if (ring === "init") return;
              if (ring === "subscribe") {
                setRing("unsubscribe");
                updateSubscribe(device.id, false);
              } else {
                setRing("subscribe");
                updateSubscribe(device.id, true);
              }
            }}
            disabled={device.state === 3}
          >
            {NotificationIcon}
          </IconButton>
        </Stack>
        <Stack direction="row">
          <Typography variant="subtitle2">状态:</Typography>
          <Tag state={STATE[device.state]} color={TAGCOLOR[device.state]} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
