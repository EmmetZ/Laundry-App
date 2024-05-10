import { green, red, grey } from "@mui/material/colors";
import { CSSProperties } from "react";

export const STATE: Record<number, string> = {
  1: "空闲",
  2: "占用",
  3: "故障",
};

export const CATEGORYCODE: Record<string, string> = {
  "00": "洗衣机",
  "01": "洗鞋机",
  "02": "烘干机",
};

export const TAGCOLOR: Record<number, CSSProperties> = {
  1: {
    backgroundColor: green[500],
    color: grey[100],
  },
  2: {
    backgroundColor: red[500],
    color: grey[100],
  },
  3: {
    backgroundColor: "gray",
    color: grey[100],
  },
};
