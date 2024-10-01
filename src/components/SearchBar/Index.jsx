import React, { useMemo } from "react";

const SearchBar = ({
  inputValue,
  submitHandler,
  setInputValue,
  isLoading,
  isPlaylistId,
  isInvalidUrl,
  isFiltering,
  prevInputValue,
}) => {
  const unChangedInputValue = useMemo(
    () => prevInputValue?.current === inputValue,
    [prevInputValue?.current, inputValue]
  );

  const isDisabled = useMemo(
    () =>
      unChangedInputValue ||
      (!isPlaylistId && isInvalidUrl) ||
      isLoading ||
      !!isFiltering,
    [unChangedInputValue, isPlaylistId, isInvalidUrl, isLoading, isFiltering]
  );

  return (
    <>
      {/* Horizontal Line */}
      <div style={{ borderTop: "1px solid rgba(128,128,128,0.5)" }}></div>

      {/* Searh Bar Component */}
      <section
        style={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: "14% 1fr 12%",
          padding: "50px 0",
        }}
      >
        <button
          style={{
            padding: "8px",
            background: "rgba(128,128,128,0.16)",
            border: "1.5px rgba(128,128,128,0.2) solid",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
            color: "rgba(79, 77, 77, 1)",
            fontSize: "15px",
            letterSpacing: "0.5px",
          }}
        >
          {inputValue.length === 0
            ? "URL"
            : isPlaylistId
            ? "ID"
            : isInvalidUrl
            ? "INVALID"
            : "URL"}
        </button>
        <input
          type="url"
          className="urlInput"
          title="Search bar"
          style={{
            fontSize: "15px",
            letterSpacing: "0.7px",
            color: "rgba(79, 77, 77, 1)",
            padding: "8px 10px",
            border: "1px rgba(128,128,128,0.5) solid",
          }}
          placeholder="Enter Playlist ID / URL"
          onChange={(e) => setInputValue(e.target.value.trim())}
          spellCheck="false"
          autoComplete="off"
          value={inputValue}
          {...((isPlaylistId || !isInvalidUrl) && {
            onKeyDown: (e) =>
              (e.key === "Enter" || e.keyCode === 13) &&
              (() => {
                submitHandler();
                e.target.blur();
              })(),
          })}
        />
        <button
          className="submit_btn"
          style={{
            padding: "8px",
            background: "none",
            border: "1.5px rgba(222, 10, 10, 1) solid",
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
            color: "rgba(222, 10, 10, 1)",
            fontSize: "15px",
            letterSpacing: "0.5px",
            transition: "all 0.2s",
          }}
          {...(isDisabled
            ? {
                disabled: isDisabled,
              }
            : {
                // Allowing submission, only when not disabled
                onClick: submitHandler,
              })}
          {...(unChangedInputValue && {
            // If the inputValue is unchanged
            title: "Un-changed input value",
          })}
        >
          Go
        </button>
      </section>

      {/* Horizontal Line */}
      <div style={{ borderTop: "1px solid rgba(128,128,128,0.5)" }}></div>
    </>
  );
};

export default SearchBar;
