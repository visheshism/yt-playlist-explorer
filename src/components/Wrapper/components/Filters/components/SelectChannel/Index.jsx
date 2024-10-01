import React from "react";

const SelectChannel = ({
  selectedChannel,
  setSelectedChannel,
  arr = [],
  isFiltering,
}) => (
  <div style={{ overflow: "hidden", width: "100%", textAlign: "left" }}>
    <span
      style={{
        color: "gray",
        fontWeight: "bold",
        paddingLeft: "6px",
        paddingRight: "6px",
        marginRight: "5px",
      }}
      className="font-Montserrat"
    >
      Channel
    </span>
    <select
      className="font-Montserrat"
      style={{
        paddingLeft: "6px",
        paddingRight: "6px",
        paddingTop: "4px",
        paddingBottom: "4px",
        borderRadius: "6px",
        border: "2px solid gray",
        fontSize: "14px",
        whiteSpace: "nowrap",
        width: "55%",
        maxWidth: "150px",
        overflow: "hidden",
      }}
      disabled={isFiltering}
      value={selectedChannel ?? ""}
      onInput={(e) => setSelectedChannel(e.target.value)}
    >
      <option
        style={{ padding: "14px" }}
        value={""}
      >
        All
      </option>
      {arr.sort().map((i, idx) => (
        <option
          key={i + idx}
          style={{
            padding: "14px",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          value={i}
        >
          {i}
        </option>
      ))}
    </select>
  </div>
);

export default SelectChannel;
