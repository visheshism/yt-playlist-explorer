import React from "react";
import Grid from "./components/Grid/Index";
import NotFound from "./components/NotFound/Index";
import FilteringComp from "./components/FilteringState/Index";
import Filters from "./components/Filters/Index";
import MetaInfo from "./components/MetaInfo/Index";
import Loader from "../StateComponents/Loader/Index";
import TotalDurationComp from "./components/TotalDuration/Index";

const Wrapper = ({
  validReq,
  isLoading,
  processingDuration,
  playlistInfo,
  totalDuration,
  isFiltering,
  shouldRender,
  dataLength,
  currentItems,
}) => {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Loading Component */}
      {(isLoading || processingDuration) && <Loader />}

      {validReq && (
        <>
          {totalDuration > 0 && (
            <>
              {/* Total Duration */}
              <TotalDurationComp totalDuration={totalDuration} />

              {/* Horizontal Line */}
              <div
                style={{
                  borderTop: "1px solid rgba(128,128,128,0.5)",
                  marginBottom: "20px",
                  width: "100%",
                }}
              ></div>
            </>
          )}

          {/* Filters */}
          {!isLoading && dataLength > 0 && (
            <Filters classes={["anim-default"]} />
          )}

          {/* Playlist Info */}
          {Object.keys(playlistInfo).length > 0 && (
            <MetaInfo
              playlistInfo={playlistInfo}
              classes={["anim-default"]}
            />
          )}

          {/* Wrapped Items */}
          {dataLength > 0 && (
            <>
              {isFiltering && <FilteringComp />}

              {!isLoading &&
                shouldRender &&
                (currentItems.length === 0 ? (
                  <NotFound />
                ) : (
                  <Grid
                    playlistId={playlistInfo.playlistId}
                    currentItems={currentItems}
                  />
                ))}
            </>
          )}
        </>
      )}
    </main>
  );
};

export default Wrapper;
