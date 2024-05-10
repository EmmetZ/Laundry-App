import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = () => {
  const label = ["设备", "设置"];
  const path = ["/device", "/setting"];
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(0);
  const location = useLocation()

  const handleClick = (index: number) => {
    if (index !== selectedItem) {
      setSelectedItem(index);
      navigate(path[index]);
    }
  };

  const handleSelected = (index: number) => {
    if (index === selectedItem) return "primary";
    return undefined;
  };

  const icons = [
    <LocalLaundryServiceIcon color={handleSelected(0)} />,
    <SettingsIcon color={handleSelected(1)} />,
  ];

  useEffect(() => {
    navigate(path[selectedItem]);
  }, []);

  useEffect(() => {
    const p = location.pathname;
    if (p !== path[selectedItem]) {
      if (p === path[0]) setSelectedItem(0);
      else if (p === path[1]) setSelectedItem(1);
    }
  }, [location]);

  const drawerWidth = 80;
  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <List component="nav">
        {label.map((text, index) => (
          <ListItem disablePadding key={text}>
            <ListItemButton
              onClick={() => handleClick(index)}
              selected={selectedItem === index}
              sx={{
                justifyContent: "center",
                py: "10px",
                "&.Mui-selected": {
                  backgroundColor: "#cce6ffcc",
                },
              }}
            >
              <ListItemIcon sx={{ justifyContent: "center" }}>
                {icons[index]}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
