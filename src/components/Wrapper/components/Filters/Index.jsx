import { useContext, useEffect, useState } from "react";
import { ctx } from "../../../../App";
import OrderBy from "./components/OrderBy/Index";
import SelectSort from "./components/SelectSort/Index";
import SelectChannel from "./components/SelectChannel/Index";
import SelectDuration from "./components/SelectDuration/Index";

const Filters = ({ classes }) => {
  const {
    channelsList,
    filters,
    setFilters,
    isFiltering,
    durationsObjList: durationsList,
    sortList,
    searchParams,
  } = useContext(ctx);

  const initial = filters.status
    ? // required: If both params exist but the filers is off, then what to do huh?
      {
        duration: searchParams.get("duration"),
        channel: searchParams.get("channel"),
        sort: searchParams.get("sort"),
      }
    : { duration: null, channel: null, sort: null };

  const [selectedChannel, setSelectedChannel] = useState(initial.channel);
  const [selectedDuration, setSelectedDuration] = useState(initial.duration);
  const [selectedSort, setSelectedSort] = useState(initial.sort?.slice(0, -1));
  const [selectedOrder, setSelectedOrder] = useState(
    initial.sort?.slice(-1) ?? "+"
  );

  useEffect(() => {
    setFilters((prev) => ({
      status:
        selectedChannel || selectedDuration || selectedSort ? true : false,
      channel: selectedChannel?.length > 0 ? selectedChannel : null,
      duration: selectedDuration?.length > 0 ? selectedDuration : null,
      sort:
        selectedSort?.length > 0 && selectedOrder
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

export default Filters;
