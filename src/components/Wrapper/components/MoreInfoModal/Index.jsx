import React, { useEffect, useRef, useState } from "react";
import closeIcon from "/modal/close.png";
import TagsComponent from "./components/Tags/Index";
import StatComponent from "./components/Stat/Index";

const MoreInfoModal = ({ data = null, closeModal }) => {
  const [opacity, setOpacity] = useState(0);
  const [isOuterClicked, setIsOuterClicked] = useState(false);

  const innerForm = useRef(null);

  const { title, description, videoId, stats, tags } = data;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.onkeydown = function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        closeModal();
      }
    };

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
    }, 200);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        width: "vmax",
        height: "vmax",
        zIndex: 9999,
        inset: 0,
        background: "rgba(0,0,0, 0.7)",
        backdropFilter: "blur(10px)",
        fontFamily: "Roboto",
        color: "#00CED1",
        transition: "all 0.3s ease-in-out",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => {
        // Zoom into the inner form
        setIsOuterClicked(true);
        if (innerForm?.current?.style) {
          innerForm.current.style.transitionDuration = "0.2s";
          innerForm.current.style.transform = "scale(1.1)";
        }
        setTimeout(() => {
          if (innerForm?.current?.style) {
            innerForm.current.style.transform = "scale(1)";
            innerForm.current.style.transitionDuration = "0.3s";
            setIsOuterClicked(false);
          }
        }, 350);
      }}
    >
      {/* Inner form */}
      <div
        style={{
          position: "relative",
          backgroundColor: "azure",
          border: "1.5px solid",
          borderColor: isOuterClicked ? "red" : "transparent",
          height: "auto",
          width: "100%",
          maxHeight: "540px",
          maxWidth: "540px",
          overflowY: "auto",
          display: "grid",
          padding: "25px 15px",
          transition: "all 0.3s ease-in-out",
          borderRadius: "6px",
          gap: "16px",
          opacity,
          transform: `scale(${opacity})`,
        }}
        className="modal-customScrollbar"
        ref={innerForm}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <span
          style={{ width: "100%", textAlign: "right", paddingBottom: "10px" }}
        >
          <img
            onClick={closeModal}
            src={closeIcon}
            alt="close"
            style={{
              width: "35px",
              height: "35px",
              margin: "0 10px",
              cursor: "pointer",
              userSelect: "none",
            }}
          />
        </span>

        {data ? (
          <>
            {/* Detailed Info */}
            {[
              ["Title", title],
              ["Description", description ?? "No description."],
              ["Video Id", videoId],
            ].map(([label, value]) => (
              <div key={label + value}>
                <label
                  style={{
                    color: "mediumvioletred",
                    letterSpacing: "0.7px",
                    padding: "4px 0px 0px",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                  }}
                >
                  {label}
                </label>
                <p
                  style={{
                    wordBreak: "break-all",
                    backgroundColor: "wheat",
                    color: "midnightblue",
                    lineHeight: "1.5rem",
                    fontWeight: "500",
                    padding: "6px",
                    margin: "4px 0px",
                    borderRadius: "4px",
                    border: "2px tan solid",
                  }}
                >
                  {value}
                </p>
              </div>
            ))}

            {/* Stats of the Video */}
            <div>
              <label
                style={{
                  color: "mediumvioletred",
                  letterSpacing: "0.7px",
                  padding: "4px 0px 0px",
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                }}
              >
                Statistics{" "}
              </label>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px 30px",
                  margin: "6px 0px 4px",
                }}
                title="Box"
              >
                {/* Sorting stats based on their value */}
                {Object.keys(stats)
                  .map((key) => ({ type: key, value: stats[key] }))
                  .filter((stat) => stat.value)
                  .sort((a, b) => b.value - a.value)
                  .map((stat) => (
                    <StatComponent
                      type={stat.type}
                      value={stat.value}
                      key={stat.type + stat.value}
                    />
                  ))}
              </div>
            </div>

            {/* Tags of the Video */}
            {tags && <TagsComponent tags={tags} />}
          </>
        ) : (
          <p
            style={{
              backgroundColor: "wheat",
              color: "brown",
              lineHeight: "1.5rem",
              fontWeight: "500",
              padding: "6px 0px",
              textAlign: "center",
              margin: "4px 0px",
              borderRadius: "4px",
              border: "2px tan solid",
              fontSize: "20px",
              margin: "10px 0px 20px 0px",
              fontFamily: "Roboto",
            }}
          >
            Nothing to show here.
          </p>
        )}
      </div>
    </div>
  );
};

export default MoreInfoModal;
