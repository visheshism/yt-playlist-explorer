import React, { useEffect, useState } from "react";
import infoIcon from "/itemCard/info.png";

const TimeStamps = ({ videoAdded, videoPublished }) => {
  const [showDiv, setShowDiv] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (showDiv) {
      setTimeout(() => {
        setOpacity(1);
      }, 100);
    }
  }, [showDiv]);

  return (
    <>
      <div
        style={{ position: "absolute", left: "-40%" }}
        onMouseEnter={() => setShowDiv(true)}
        onMouseLeave={() => setShowDiv(false)}
      >
        {/* Info Icon */}
        <img
          src={infoIcon}
          alt="info"
          style={{
            width: "20px",
            height: "20px",
            margin: "0 10px",
            cursor: "pointer",
          }}
        />

        {showDiv && (
          <div
            style={{
              position: "absolute",
              left: "38px",
              top: `-${!videoAdded || !videoPublished ? "45" : "85"}px`,
              background: "rgba(0,0,0, 0.7)",
              backdropFilter: "blur(10px)",
              padding: "5px 12px",
              paddingBottom: "14px",
              minWidth: "max-content",
              fontSize: "13px",
              fontFamily: "Roboto",
              borderRadius: "5px",
              color: "#00CED1",
              fontWeight: "500",
              opacity,
              transition: "all 0.3s ease-in-out",
            }}
          >
            {/* Video Added */}
            {videoAdded ? (
              <>
                <p>Video added to playlist:</p>
                <span
                  style={{
                    color: "white",
                  }}
                >
                  {videoAdded}
                </span>
              </>
            ) : (
              <></>
            )}

            {/* Video Published */}
            {videoPublished ? (
              <>
                <p>Video published to Youtube:</p>
                <span
                  style={{
                    color: "white",
                  }}
                >
                  {videoPublished}
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TimeStamps;
