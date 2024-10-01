import React from "react";
import commentsIcon from "/modal/comment.png";
import likesIcon from "/modal/like.png";
import viewsIcon from "/modal/view.png";

const StatComponent = ({ type = null, value = null }) => {
  const imgs = {
    likes: likesIcon,
    comments: commentsIcon,
    views: viewsIcon,
  };

  if (!type || !value) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "2px solid wheat",
        width: "min-content",
        padding: "6px 6px",
        borderRadius: "6px",
        background: "lightyellow",
      }}
      title={type[0].toUpperCase() + type.slice(1).toLowerCase()}
    >
      {/* Icon */}
      <img
        src={imgs[type]}
        style={{ height: "30px", width: "30px" }}
      />
      {/* Stat Value */}
      <span
        style={{
          color: "chocolate",
          fontWeight: "bold",
          fontFamily: "Montserrat",
          letterSpacing: "1.2px",
          fontSize: "1.1rem",
        }}
      >
        {value}
      </span>
    </div>
  );
};

export default StatComponent;
