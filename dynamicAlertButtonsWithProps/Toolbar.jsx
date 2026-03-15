import React from "react";
import AlertButton from "./AlertButton";

export default function Toolbar() {
  const buttons = [
    { message: "Downloading!", children: "Download File" },
    { message: "Sharing!", children: "Share Document" },
    { message: "Uploading!", children: "Upload Image" },
    { message: "Deleting!", children: "Delete Item" },
    { message: "Saving!", children: "Save Changes" },
    { message: "No action!", children: "Do Nothing" },
  ];

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {buttons.map((btn, idx) => (
        <AlertButton key={idx} message={btn.message}>
          {btn.children}
        </AlertButton>
      ))}
    </div>
  );
}
