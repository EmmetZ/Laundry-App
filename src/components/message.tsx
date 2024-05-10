import { Alert, Snackbar } from "@mui/material";
import useStore from "../store";

const Message = () => {
  const setOpen = useStore((state) => state.setMesOpen);
  const isOpen = useStore((state) => state.isMesOpen);
  const type = useStore((state) => state.messageType);
  const message = useStore((state) => state.message);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={isOpen}
      onClose={handleClose}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      autoHideDuration={3000}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Message;
