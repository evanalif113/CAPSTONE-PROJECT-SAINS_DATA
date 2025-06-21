import React from "react";

const LoadingSpinner = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh"
  }}>
    <div style={{
      border: "6px solid #f3f3f3",
      borderTop: "6px solid #3498db",
      borderRadius: "50%",
      width: 48,
      height: 48,
      animation: "spin 1s linear infinite"
    }} />
    <p style={{ marginTop: 16, fontSize: 18, color: "#555" }}>Memuat data...</p>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner;