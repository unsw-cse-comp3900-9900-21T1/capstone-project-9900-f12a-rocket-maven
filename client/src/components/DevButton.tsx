import React from "react";
import { Button } from "antd";

const DevButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    type="primary"
    onClick={onClick}
    style={{
      zIndex: 2000,
      position: "absolute",
      marginRight: "70px",
      marginTop: "70px",
    }}
  >
    DevDev
  </Button>
);

export { DevButton };
