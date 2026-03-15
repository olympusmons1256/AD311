import React from "react";
import AlertButton from "./AlertButton";

export default function Toolbar() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <AlertButton message="Playing music!">Play</AlertButton>
      <AlertButton message="Uploading file!">Upload</AlertButton>
      <AlertButton message="Downloading data!">Download</AlertButton>
    </div>
  );
}
