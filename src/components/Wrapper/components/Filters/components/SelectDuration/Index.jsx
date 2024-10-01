import React from "react";

const SelectDuration = ({
  selectedDuration,
  setSelectedDuration,
  arr,
  isFiltering,
}) => (
  <div style={{ width: "100%", textAlign: "right" }}>
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
      Duration
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
      }}
      value={selectedDuration ?? ""}
      disabled={isFiltering}
      onInput={(e) => setSelectedDuration(e.target.value)}
    >
      <option
        style={{ padding: "14px" }}
        value={""}
      >
        All
      </option>
      {arr?.map(({ value, text }, idx) => (
        <option
          style={{ padding: "14px" }}
          value={value}
          key={value + text + idx}
        >
          {value.includes("lt") ? "<" : value.includes("gt") ? ">" : ""}
          &nbsp;&nbsp;
          {text}
        </option>
      ))}
    </select>
  </div>
);

export default SelectDuration;
