import React from "react";

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
      >
        {/* Ascending Order */}
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

        {/* Divider */}
        <span
          style={{
            margin: "0",
            borderRight: "1px solid gray",
            borderLeft: "1px solid gray",
            opacity: "0.4",
          }}
        ></span>

        {/* Descending Order */}
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

export default OrderBy;
