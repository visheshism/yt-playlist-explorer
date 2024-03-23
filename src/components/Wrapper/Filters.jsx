import { useEffect } from "react";
import { useState } from "react";

const Filters = ({
  channelsList,
  setFilters,
  isFiltering,
  initial,
  classes,
  durationsList,
  sortList,
}) => {
  const [selectedChannel, setSelectedChannel] = useState(initial.channel);
  const [selectedDuration, setSelectedDuration] = useState(initial.duration);
  const [selectedSort, setSelectedSort] = useState(initial.sort?.slice(0, -1));
  const [selectedOrder, setSelectedOrder] = useState(
    initial.sort?.slice(-1) ?? "+"
  );

  useEffect(() => {
    setFilters((prev) => ({
      status: (selectedChannel || selectedDuration) ? true : false,
      channel: selectedChannel?.length > 0 ? selectedChannel : null,
      duration: selectedDuration?.length > 0 ? selectedDuration : null,
      sort:
        (selectedSort?.length > 0 && selectedOrder)
          ? `${selectedSort}${selectedOrder}`
          : null,
    }));
  }, [selectedChannel, selectedDuration, selectedSort, selectedOrder]);

  return (
    <div
      className={`${classes.join(" ")}`}
      style={{
        paddingTop: "20px",
        paddingBottom: "20px",
        display: "grid",
        width: "100%",
        gap: "40px 80px",
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
      <SelectSort
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        arr={sortList}
        isFiltering={isFiltering}
      />
      {selectedSort && (
        <OrderBy
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          isFiltering={isFiltering}
        />
      )}
    </div>
  );
};

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

const OrderBy = ({ selectedOrder, setSelectedOrder, isFiltering }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        placeItems: "center",
      }}
    >
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
        Order
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          border: "2px gray solid",
          borderRadius: "6px",
          width: "min-content",
        }}
        className="sortBy"
      >
        <div
          className={`sortChild ${(selectedOrder === "+" && "active") || ""}`}
          onClick={() => !isFiltering && setSelectedOrder("+")}
        >
          <img
            src="/filters/asc.png"
            style={{
              width: "20px",
              opacity: "0.7",
              background: "transparent",
              display: "flex",
              placeItems: "center",
            }}
          />
        </div>
        <span
          style={{
            margin: "0",
            borderRight: "1px solid gray",
            borderLeft: "1px solid gray",
            opacity: "0.4",
          }}
        ></span>
        <div
          className={`sortChild ${(selectedOrder === "-" && "active") || ""}`}
          onClick={() => !isFiltering && setSelectedOrder("-")}
        >
          <img
            src="/filters/desc.png"
            style={{
              width: "20px",
              opacity: "0.7",
              background: "transparent",
              display: "flex",
              placeItems: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
