import { Card, CardContent, Typography } from "@mui/material";
import React, { CSSProperties } from "react";
import { STATE } from "../utils/constant";

interface Props {
  state: string;
  color: CSSProperties;
}

const Tag = ({ state, color }: Props) => {
  return (
    <Card
      sx={{
        padding: 0,
        mx: "6px",
        ...color,
      }}
      elevation={0}
    >
      <CardContent
        sx={{
          margin: 0,
          height: "100%",
          "&.MuiCardContent-root": {
            padding: "3px 5px",
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>{state}</Typography>
      </CardContent>
    </Card>
  );
};

export default Tag;
