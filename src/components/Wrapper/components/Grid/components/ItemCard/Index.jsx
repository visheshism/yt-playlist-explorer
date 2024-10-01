import { useContext } from "react";
import { ctx } from "../../../../../../App";
import {
  getTimeString,
  secToDateTimeString,
} from "../../../../../../utils/timeConversion";
import MoreInformation from "./components/MoreInformation/Index";
import TimeStamps from "./components/Timestamps/Index";

const ItemCard = ({
  idx = 0,
  playlistId,
  Item: {
    title,
    description,
    duration = 0,
    videoId,
    videoAdded,
    videoPublishedAt,
    channel = null,
    image = "/itemCard/not-found.2056c908.png",
    tags,
    stats = { likeCount: null, viewCount: null, commentCount: null },
  },
}) => {
  const { setModalProps } = useContext(ctx);

  const { likeCount: likes, commentCount: comments, viewCount: views } = stats;

  return (
    <article
      className="itemCard"
      style={{
        paddingLeft: "15px",
        paddingRight: "15px",
        marginTop: "3rem",
        minHeight: "338px !important",
        alignSelf: "stretch",
        position: "relative",
      }}
    >
      <div
        style={{
          border: "1px rgba(128,128,128,0.3) solid",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Thumbnail */}
        <img
          src={`${image}`}
          alt={title}
          style={{
            width: "100%",
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            padding: "10px 20px",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          {/* Title */}
          <h3
            className="text-truncate"
            style={{
              fontFamily: "sans-serif",
              margin: "6px 0",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            {!isNaN(idx) ? idx + 1 + "." : ""} {title}
          </h3>

          {/* Duration of video */}
          <h4
            className="font-Montserrat"
            style={{
              color: "rgba(128,128,128,1)",
              fontWeight: 550,
              letterSpacing: "0.6px",
              margin: 0,
              margin: "6px 0",
              fontSize: "14px",
            }}
          >
            {duration > 0 || ["Deleted video", "Private video"].includes(title)
              ? getTimeString(duration)
              : "Calculating duration..."}
          </h4>

          {/* Description (if exists) */}
          <p
            className="text-truncate"
            style={{
              width: "100%",
              margin: "10px 0",
              fontFamily: "sans-serif",
              letterSpacing: "0.5px",
              marginBottom: "20px",
              ...(!description?.length > 0 && { minHeight: "18px" }),
            }}
          >
            {description ?? ""}
          </p>

          <div
            style={{
              position: "relative",
              width: "fit-content",
              margin: "0 auto",
              paddingBottom: "10px",
            }}
          >
            {/* Timestamps Icon */}
            {videoAdded || videoPublishedAt ? (
              <TimeStamps
                videoAdded={secToDateTimeString(videoAdded)}
                videoPublished={secToDateTimeString(videoPublishedAt)}
              />
            ) : (
              <></>
            )}

            {/* Watch Video Button */}
            <a
              href={`https://youtube.com/watch?v=${videoId}&list=${playlistId}`}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: "none",
                background: "rgba(54, 130, 233, 1)",
                color: "white",
                fontFamily: "sans-serif",
                letterSpacing: "0.8px",
                textDecoration: "none",
              }}
              target="__blank"
            >
              Watch Video
            </a>

            {/* More Info Modal Toggle Icon */}
            {duration > 0 ? (
              <MoreInformation
                showModal={() => {
                  setModalProps((prev) => ({
                    ...prev,
                    show: true,
                    data: {
                      title,
                      description,
                      videoId,
                      stats: {
                        likes,
                        comments,
                        views,
                      },
                      tags,
                    },
                  }));
                }}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
