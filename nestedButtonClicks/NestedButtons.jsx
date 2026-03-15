import React from "react";

export default function NestedButtons() {
  function handleOuterClick() {
    alert("Outer container clicked!");
  }

  function handleInnerClick(e) {
    e.stopPropagation();
    alert("Inner button clicked!");
  }

  return (
    <div
      style={{
        padding: "2rem",
        border: "2px solid #333",
        borderRadius: "8px",
        display: "inline-block",
        background: "#f9f9f9",
      }}
      onClick={handleOuterClick}
    >
      <button
        style={{ fontSize: "1.2rem", padding: "0.5rem 1.5rem" }}
        onClick={handleInnerClick}
      >
        Inner Button
      </button>
    </div>
  );
}
