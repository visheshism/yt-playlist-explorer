import React from "react";

const SelectSort = ({ selectedSort, setSelectedSort, arr, isFiltering }) => (
  <div style={{ width: "100%", textAlign: "right", overflow: "hidden" }}>
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
      Sort
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
        width: "100%",
        maxWidth: "140px",
      }}
      value={selectedSort ?? ""}
      disabled={isFiltering}
      onInput={(e) => setSelectedSort(e.target.value)}
    >
      <option
        style={{ padding: "14px" }}
        value={""}
      >
        None
      </option>
      {arr?.map((value, idx) => (
        <option
          style={{ padding: "14px" }}
          value={value}
          key={value + idx}
        >
          {value}
        </option>
      ))}
    </select>
  </div>
);

export default SelectSort;
