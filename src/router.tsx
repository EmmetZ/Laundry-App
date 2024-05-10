import { createBrowserRouter, createHashRouter } from "react-router-dom";
import DefaultPage from "./pages/default_page";
import DevicePage from "./pages/device_page";
import SettingPage from "./pages/setting_page";
import ErrorPage from "./pages/error_page";

const router = createHashRouter([
  {
    path: "/",
    element: <DefaultPage />,
    children: [
      { path: "device", element: <DevicePage /> },
      { path: "setting", element: <SettingPage />}
    ],
    errorElement: <ErrorPage />
  },
]);

export default router;