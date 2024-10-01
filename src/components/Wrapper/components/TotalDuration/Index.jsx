import React from "react";
import { getTimeString } from "../../../../utils/timeConversion";

const TotalDuration = ({ totalDuration }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        margin: "28px 0",
        border: "1px solid rgba(128,128,128,0.5)",
        borderRadius: "4px",
        opacity: 0,
        animation: "toOpacity1 2s forwards",
      }}
    >
      <h3
        className="font-Montserrat"
        style={{
          width: "100%",
          textAlign: "center",
          margin: "0",
          padding: "10px 0",
          background: "rgba(128,128,128,0.1)",
          color: "rgba(120,120,120,1)",
          fontWeight: "600",
          fontSize: "16px",
          letterSpacing: "0.2px",
        }}
      >
        Total Playlist Duration
      </h3>

      <div
        style={{ borderTop: "1px solid rgba(128,128,128,0.5)", width: "100%" }}
      ></div>

      <h3
        className="font-Montserrat"
        style={{
          width: "100%",
          textAlign: "center",
          fontWeight: "400",
          fontSize: "16px",
          letterSpacing: "0.2px",
        }}
      >
        {getTimeString(totalDuration)}
      </h3>
    </div>
  );
};

export default TotalDuration;
