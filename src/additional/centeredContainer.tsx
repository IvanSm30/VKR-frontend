import React from "react";

const CenteredContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f6fa",
      padding: "24px",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "32px 32px 24px 32px",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        minWidth: 350,
        maxWidth: 400,
        width: "100%",
      }}
    >
      {children}
    </div>
  </div>
);

export default CenteredContainer;
