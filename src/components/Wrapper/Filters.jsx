import { useEffect, useRef } from "react";
import { useState } from "react";

const Filters = ({
  channelsList,
  setFilters,
  isFiltering,
  initial,
  classes,
  durationsList,
}) => {
  const [selectedChannel, setSelectedChannel] = useState(initial.channel);
  const [selectedDuration, setSelectedDuration] = useState(initial.duration);

  useEffect(() => {
    setFilters((prev) => ({
      status: selectedDuration || selectedDuration ? true : false,
      channel: selectedChannel?.length > 0 ? selectedChannel : null,
      duration: selectedDuration?.length > 0 ? selectedDuration : null,
    }));

  }, [selectedChannel, selectedDuration]);

  return (
    <div
      className={`${classes.join(" ")}`}
      style={{
        paddingTop: "20px",
        paddingBottom: "20px",
        display: "grid",
        width: "100%",
        gap: "80px",
        margin: "10px 0",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <SelectDuration
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        arr={durationsList}
        isFiltering={isFiltering}
      />
      <SelectChannel
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        arr={channelsList}
        isFiltering={isFiltering}
      />
    </div>
  );
};

const SelectChannel = ({
  selectedChannel,
  setSelectedChannel,
  isFiltering,
  arr = [],
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

export default Filters;
