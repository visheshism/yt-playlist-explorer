import React from "react";
import ItemCard from "./components/ItemCard/Index";

const Grid = ({ playlistId, currentItems }) => {
  return (
    <div
      style={{
        display: "grid",
        margin: "10px 0px",
        width: "100%",
        justifyContent: "center",
        animationDelay: "0.3s",
      }}
      className="anim-default wrapper-grid"
    >
      {currentItems
        ?.map((i) => ({
          ...i,
          ...((!i.desciption || i.desciption?.length === 0) && {
            desciption: null,
          }),
        }))
        .map((i, idx) => (
          <ItemCard
            Item={i}
            key={i.videoId + i.position}
            playlistId={playlistId}
            idx={idx}
          />
        ))}
    </div>
  );
};

export default Grid;
