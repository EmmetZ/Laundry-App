import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useStore from "../store";

const SettingPage = () => {
  const id = useStore((state) => state.id);
  const setId = useStore((state) => state.setId);
  const setNotification = useStore((state) => state.setNotification);
  const notification = useStore((state) => state.notification);
  const [interval, setInterval] = useState(3);
  const [closeAction, setCloseAction] = useState("quit");

  useEffect(() => {
    window.store.getInterval().then((value) => setInterval(value));
    window.store.getCloseAction().then((value) => setCloseAction(value));
  }, []);

  return (
    <>
      <Typography variant="h5" component="div">
        设置
      </Typography>
      <List
        sx={{
          width: "100%",
          maxWidth: 550,
        }}
      >
        <ListItem>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="楼栋id" />
          <TextField
            size="small"
            sx={{
              width: "125px",
            }}
            value={id === -1 ? "" : id}
            onChange={(e) => {
              let value = parseInt(e.target.value);
              if (isNaN(value)) value = -1;
              setId(value);
              window.store.updateId(value);
            }}
            error={typeof id === "string" || id < 0}
            autoFocus={id === -1}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <HourglassTopIcon />
          </ListItemIcon>
          <ListItemText primary="刷新数据间隔（分钟）" />
          <TextField
            size="small"
            sx={{
              width: "75px",
            }}
            value={interval < 1 ? "" : interval}
            onChange={(e) => {
              let value = parseInt(e.target.value);
              if (isNaN(value) || value < 1) value = 0;
              setInterval(value);
              window.store.setInterval(value < 1 ? 1 : value);
            }}
            error={interval < 1}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary="禁用通知" />
          <Switch
            checked={!notification}
            onChange={(e) => {
              setNotification(!e.target.checked);
              window.store.setNotification(!e.target.checked);
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CancelPresentationIcon />
          </ListItemIcon>
          <ListItemText primary="关闭窗口" />
          <Select
            value={closeAction}
            onChange={(e) => {
              setCloseAction(e.target.value as string);
              window.store.setCloseAction(e.target.value);
              console.log(e.target.value);
            }}
            sx={{ width: '150px'}}
          >
            <MenuItem value="quit">退出应用</MenuItem>
            <MenuItem value="hide">最小化至托盘</MenuItem>
          </Select>
        </ListItem>
      </List>
    </>
  );
};

export default SettingPage;
