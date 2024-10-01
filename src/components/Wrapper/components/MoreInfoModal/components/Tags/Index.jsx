import React, { useEffect, useRef, useState } from "react";
import dropdownIcon from "/modal/dropdown.png";

const TagsComponent = ({ tags }) => {
  const [showList, setshowList] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const tagsRef = useRef(null);

  useEffect(() => {
    if (showList) {
      if (tagsRef?.current) {
        tagsRef.current.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        setOpacity(1);
      }, 500);
    } else {
      setTimeout(() => {
        setOpacity(0);
      }, 200);
    }
  }, [showList]);

  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", gap: "6px" }}
        ref={tagsRef}
        onClick={() => setshowList((prev) => !prev)}
      >
        {/* Label */}
        <label
          style={{
            color: "mediumvioletred",
            letterSpacing: "0.7px",
            padding: "4px 0px 0px",
            fontFamily: "Montserrat",
            fontWeight: "bold",
          }}
          {...(showList && {
            onClick: (e) => e.stopPropagation(),
          })}
        >
          Tags
        </label>

        {/* Toggle status depicting Icon */}
        <img
          src={dropdownIcon}
          style={{
            height: "18px",
            width: "14px",
            marginTop: "4px",
            transform: `rotate(${showList ? "0deg" : "-90deg"})`,
            transition: "all 0.2s ease-in-out",
          }}
          title={showList ? "Hide" : "Expand"}
        />
      </div>

      {/* Tags */}
      {showList && (
        <ul
          className="tagsList"
          style={{
            opacity,
            transition: "all 0.4s ease-in-out",
          }}
        >
          {tags.map((tag, idx) => (
            <li
              title="Tag"
              key={tag + idx}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsComponent;
