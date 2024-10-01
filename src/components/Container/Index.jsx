import React from "react";

const Container = ({ children }) => {
  return (
    <div
      className="container"
      style={{
        width: "100%",
        paddingRight: "15px",
        paddingLeft: "15px",
        marginRight: "auto",
        marginLeft: "auto",
        scrollBehavior: "smooth",
      }}
    >
      {children}
    </div>
  );
};

export default Container;
