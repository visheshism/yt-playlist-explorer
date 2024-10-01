import React from "react";
import moreInfoIcon from "/itemCard/moreinfo.png";

const MoreInformation = ({ showModal }) => {
  return (
    <div
      style={{ position: "absolute", right: "-40%", top: "-4px" }}
      onClick={() => showModal()}
    >
      <img
        src={moreInfoIcon}
        alt="moreInfo"
        style={{
          width: "25px",
          height: "25px",
          margin: "0 10px",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default MoreInformation;
