import React from "react";
import NestedButtons from "./NestedButtons";

export default function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Event Propagation Demo</h1>
      <NestedButtons />
    </div>
  );
}
