import React from "react";

const Welcome = () => {
  return (
    <div
      className="jumbotron"
      style={{
        backgroundColor: "rgba(98, 222, 143, 0.3)",
        color: "rgba(0, 57, 21, 0.9)",
        borderRadius: "6px",
        padding: "20px 20px",
        opacity: 0,
        animation: "toOpacity1 4s forwards",
        marginTop: "40px",
        width: "100%",
      }}
    >
      <h3
        className="font-Montserrat"
        style={{
          fontSize: "24px",
          fontWeight: 550,
          letterSpacing: "1.2px",
          textAlign: "center",
        }}
      >
        Hey!
      </h3>
      <p
        style={{
          textAlign: "center",
          fontFamily: "sans-serif",
          letterSpacing: "0.7px",
        }}
      >
        Analyze YouTube playlists with various tools.
      </p>
      <p
        style={{
          textAlign: "center",
          fontFamily: "sans-serif",
          letterSpacing: "0.7px",
        }}
      >
        Filter by duration, channel, sort order, and get detailed info on each
        item.
      </p>
      <br />
      <h3
        className="font-Montserrat"
        style={{
          textAlign: "center",
          letterSpacing: "1px",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Just paste the URL above and hit Go.
      </h3>

      <div
        style={{
          borderTop: "1px solid rgba(128,128,128,0.5)",
          maxWidth: "90%",
          margin: "40px auto",
        }}
      ></div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <a
          href="https://github.com/visheshism/Yt-Playlist-Explorer"
          target="_blank"
          style={{
            textDecoration: "none",
            fontFamily: "inherit",
            color: "inherit",
          }}
        >
          Source
        </a>
        <div>
          Made by&nbsp;
          <a
            href="https://github.com/visheshism"
            target="_blank"
            style={{
              textDecoration: "none",
              fontFamily: "sans-serif",
              color: "inherit",
            }}
          >
            Vishesh Singh
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default Welcome;