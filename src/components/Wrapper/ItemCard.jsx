import { useContext, useEffect, useState } from "react";
import { ctx } from "../../App";
import { getTimeString, secToDateTimeString } from "../../utils/timeConversion";
import infoIco from "/itemCard/info.png";
import moreInfoIco from "/itemCard/moreinfo.png";

const ItemCard = ({
  idx = 0,
  playlistId, Item: { title, description, duration = 0, videoId, videoAdded, videoPublishedAt, channel = null, image = '/itemCard/not-found.2056c908.png', tags, stats = { likeCount: null, viewCount: null, commentCount: null } } }) => {

  const { setModalProps } = useContext(ctx)

  const { likeCount: likes, commentCount: comments, viewCount: views } = stats

    return (<article className='itemCard' style={{
        paddingLeft: '15px', paddingRight: '15px', marginTop: '3rem', 
        minHeight: "338px !important",
        alignSelf: "stretch",
        position: "relative",
    }}>
        <div style={{ border: '1px rgba(128,128,128,0.3) solid', borderRadius: '6px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

            <img src={`${image}`} alt={title} style={{ width: '100%', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', flexShrink: 0 }} />

            <div style={{ padding: '10px 20px', textAlign: 'center', marginBottom: '15px' }}>

                <h3 className='text-truncate' style={{ fontFamily: 'sans-serif', margin: '6px 0', fontSize: '24px', fontWeight: 600 }}>
                    {!isNaN(idx) ? idx + 1 + '.' : ''} {title}
                </h3>

                <h4 className='font-Montserrat' style={{ color: 'rgba(128,128,128,1)', fontWeight: 550, letterSpacing: '0.6px', margin: 0, margin: '6px 0', fontSize: '14px' }}>{duration > 0 || ['Deleted video', 'Private video'].includes(title) ? getTimeString(duration) : 'Calculating duration...'}</h4>

                <p className='text-truncate' style={{ width: '100%', margin: '10px 0', fontFamily: 'sans-serif', letterSpacing: '0.5px', marginBottom: '20px',
              ...(!description?.length > 0 && { minHeight: "18px" }),
                 }}>{description ?? ""}</p>

        <div
            style={{
              position: "relative",
              width: "fit-content",
              margin: "0 auto",
              paddingBottom: "10px",
            }}
          >

            {(videoAdded || videoPublishedAt) ? (
              <InformationDiv
                videoAdded={secToDateTimeString(videoAdded)}
                videoPublished={secToDateTimeString(videoPublishedAt)}
              />):<></>
            }
            
                <a href={`https://youtube.com/watch?v=${videoId}&list=${playlistId}`} style={{ padding: '10px', borderRadius: '4px', border: 'none', background: 'rgba(54, 130, 233, 1)', color: 'white', fontFamily: 'sans-serif', letterSpacing: '0.8px', textDecoration: 'none' }} target="__blank">Watch Video</a>
                  
            {(duration > 0) ? (
              <MoreInformationToggle
                showModal={() => {
                  setModalProps((prev) => ({
                    ...prev, show: true, data: {
                      title, description, videoId, stats: {
                        likes,
                        comments,
                        views
                      }, tags
                    }
                  }))
                }}
              />) : <></>
            }
            
                </div>

            </div>

        </div>

    </article>)
}

const InformationDiv = ({ videoAdded, videoPublished }) => {
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
          <img
            src={infoIco}
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
                top: `-${!videoAdded || !videoPublished ? "45" : "85" }px`,
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


const MoreInformationToggle = ({ showModal }) => {

  return (
    <div
      style={{ position: "absolute", right: "-40%", top: "-4px" }}
      onClick={() => showModal()}
    >
      <img
        src={moreInfoIco}
        alt="moreInfo"
        style={{
          width: "25px",
          height: "25px",
          margin: "0 10px",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default ItemCard
