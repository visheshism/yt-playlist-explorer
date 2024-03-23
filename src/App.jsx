import { useEffect, useState } from "react";
import "./App.css";
import { getListItems, getPlaylistInfo, getVideoMetaData } from "./api";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Error from "./components/Error";
import PlaylistInfoComp from "./components/Wrapper/PlaylistInfo";
import ItemCard from "./components/Wrapper/ItemCard";
import TotalDurationComp from "./components/Wrapper/TotalDuration";
import Loader from "./components/Loader";
import { useSearchParams } from "react-router-dom";
import Filters from "./components/Wrapper/Filters";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramId = searchParams.get("id");
  const paramUrl = searchParams.get("url");
  const validReq = paramId || paramUrl;

  const [inputUrl, setInputUrl] = useState((paramId || paramUrl) ?? "");
  const [playlistInfo, setPlaylistInfo] = useState({});
  const [data, setData] = useState([]);
  const [processingDuration, setProcessingDuration] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [channelsList, setChannelsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState("initial");

  const [filters, setFilters] = useState({
    status: !!searchParams.get("filters"),
    channel: searchParams.get("channel"),
    duration: searchParams.get("duration"),
    sort: searchParams.get("sort"),
  });

  const [currentItems, setCurrentItems] = useState(data);
  
  const [shouldRender, setShouldRender] = useState(false);
  

  const playlistIdRegExp = /^[a-zA-Z0-9_-]{12,}$/;
  const isPlaylistId = playlistIdRegExp.test(inputUrl);

  const isInvalidUrl =
    (!inputUrl.includes("https://youtube.com/playlist?list=") &&
      !inputUrl.includes("https://www.youtube.com/playlist?list=") &&
      !inputUrl.includes("www.youtube.com/playlist?list=")) ||
    !inputUrl.split("youtube.com/playlist?list=")[1];

  const getData = async (url, nextPage) => {
    if (isPlaylistId) url = `https://youtube.com/playlist?list=${inputUrl}`;

    const searchParams = new URLSearchParams(url.split("?")[1]);
    const playListId = searchParams.get("list");

    if (playListId.length > 1) {
      const PlaylistInfo = await getPlaylistInfo(playListId);
      setPlaylistInfo(PlaylistInfo);

      if (Object.keys(PlaylistInfo).length > 0) {
        const playlistData = await getListItems(playListId, nextPage);

        setData((prev) => {
          setCurrentItems((prev1) => [...prev1, ...playlistData.items]);
          return [...prev, ...playlistData.items];
        });

        const { nextPageToken } = playlistData;

        if (nextPageToken) {
          return getData(url, nextPageToken);
        }

        setProcessingDuration(true);
      } else {
        setState("error");
      }
    } else {
      setState("error");
    }
  };

  const submitHandler = () =>
    setSearchParams({ [isPlaylistId ? "id" : "url"]: inputUrl });

  const processRequest = () => {
    if (validReq) {
      setIsLoading(true);
      setProcessingDuration(false);
      setState("fetching");

      setPlaylistInfo({});
      setData([]);
      setTotalDuration(0);

      getData(inputUrl);
    }
  };

  useEffect(() => {
    const setDuration = async () => {
      return new Promise((resolve, reject) => {
        try {
          resolve(
            (async () => {
              const [durationData, channelsData, publishDtTiObj] = await getVideoMetaData(data);

              const updatedData = data.map((item, idx) => ({
                ...item,
                ide: idx,
                duration: durationData[item.videoId] ?? 0,
                channel: channelsData[item.videoId] ?? "",
              }));

              setData(() => [...updatedData]);
              setCurrentItems(() => [...updatedData]);
              setTotalDuration(
                updatedData
                  .filter((i) => i.duration)
                  .map((i) => Number(i.duration))
                  .reduce((total, num) => total + num, 0)
              );

              const channelListFromData = [
                ...new Set([
                  ...updatedData
                    .map(({ channel }) => channel)
                    .filter((i) => i.length > 0),
                ]),
              ];
              setChannelsList(channelListFromData);

              setSearchParams({
                ...[...searchParams].filter(
                  ([a, b]) =>
                    (!filters.channel ||
                      (filters.channel &&
                        channelListFromData.includes(filters.channel)) ||
                      (!(
                        filters.channel &&
                        channelListFromData.includes(filters.channel)
                      ) &&
                        a !== "channel")) &&
                    (!filters.duration ||
                      (filters.duration &&
                        durationsList.includes(filters.duration)) ||
                      (!(
                        filters.duration &&
                        durationsList.includes(filters.duration)
                      ) &&
                        a !== "duration")) &&
                        (!filters.sort ||
                        (filters.sort &&
                          sortList.includes(filters.sort.slice(0, -1)) &&
                          ["+", "-"].includes(filters.sort.slice(-1))) ||
                        (!(
                          filters.sort &&
                          sortList.includes(filters.sort.slice(0, -1)) &&
                          ["+", "-"].includes(filters.sort.slice(-1))
                        ) &&
                          a !== "sort")) &&
                    ((!(
                      !!filters.duration &&
                      durationsList.includes(filters.duration)
                    ) &&
                      !(
                        !!filters.channel &&
                        channelListFromData.includes(filters.channel)
                      ) &&
                      !(
                          !!filters.sort &&
                          sortList.includes(filters.sort.slice(0, -1)) &&
                          ["+", "-"].includes(filters.sort.slice(-1))
                        ) &&
                      a !== "filters") ||
                      (!!filters.duration &&
                        durationsList.includes(filters.duration)) ||
                      (!!filters.channel &&
                        channelListFromData.includes(filters.channel)) ||
                        (!!filters.sort &&
                          sortList.includes(filters.sort.slice(0, -1)) &&
                          ["+", "-"].includes(filters.sort.slice(-1))))
                ).reduce((acc, cur) => {
                    const [key, value] = cur
                    acc[key] = value
                    return acc
                  }, {}),
              });

              /* equivalent: 
              setSearchParams({
                [isPlaylistId ? "id" : "url"]: inputUrl,
                ...(((filters.channel &&
                  channelListFromData.includes(filters.channel)) ||
                  (filters.duration &&
                    durationsList.includes(filters.duration))) && {
                  filters: true,
                }),
                ...(filters.channel &&
                  channelListFromData.includes(filters.channel) && {
                  channel: filters.channel,
                }),
                ...(filters.duration &&
                  durationsList.includes(filters.duration) && {
                  duration: filters.duration,
                }),
              })
              */

              setFilters((prev) => ({
                ...prev,
                ...(prev.duration &&
                  !durationsList.includes(prev.duration) && { duration: null }),
                ...(prev.channel &&
                  !channelListFromData.includes(prev.channel) && {
                    channel: null,
                  }),
                  ...(prev.sort &&
                  !(
                    sortList.includes(prev.sort.slice(0, -1)) &&
                    ["+", "-"].includes(prev.sort.slice(-1))
                  ) && {
                    sort: null,
                  }),
                ...(!(prev.duration && durationsList.includes(prev.duration)) &&
                  !(
                    prev.channel && channelListFromData.includes(prev.channel)
                    ) &&
                  !(
                    prev.sort &&
                    sortList.includes(prev.sort.slice(0, -1)) &&
                    ["+", "-"].includes(prev.sort.slice(-1))
                  ) && {
                    status: false,
                  }),
              }));

              return true;
            })()
          );
        } catch (error) {
          reject(error);
        }
      });
    };

    if (processingDuration && data.length > 0) {
      setDuration().then((result) => {
        setProcessingDuration(false);
        setIsLoading(false);

        setState("fetched");
        filters.status === true ? setState("filtering") : setShouldRender(true);
      });
    }
  }, [processingDuration]);

  const [isFiltering, setIsFiltering] = useState(false);

  const durationsObjList = [
    { text: "5 min", value: `lt-${5 * 60}` },
    { text: "40 min", value: `gt-${40 * 60}` },
  ];
  const durationsList = durationsObjList.map(({ value }) => value);
  const sortList = ["Video Added", "Duration", "Video Published"];

  useEffect(() => {
    if (state === "error") {
      setIsLoading(false);
    } else if (state === "filtering") {

      const returnBoolBasedOnDurationStr = (str = "gt-0", duration) => {
        const required = str.split("-")[1];
        if (str.includes("gt")) {
          return duration > required;
        } else if (str.includes("lt")) {
          return duration < required;
        } else return false;
      };

const sortObj = {
        "Video Added": (a, b) => a.videoAdded - b.videoAdded,
        Duration: (a, b) => a.duration - b.duration,
        "Video Published": (a, b) => a.videoPublishedAt - b.videoPublishedAt,
      };

      setCurrentItems(() => {
        // Filtered data without sort
        const filteredWoSort = [
        ...data.filter(
          ({ channel, duration }) =>
            (!filters.channel || channel === filters.channel) &&
            (!filters.duration ||
              returnBoolBasedOnDurationStr(filters.duration, duration))
        ),
      ];

        const final = filters.sort
          ? filteredWoSort.sort(
              (a, b) =>
                sortObj[filters.sort.slice(0, -1)](a, b) *
                (filters.sort.slice(-1) === "+" ? 1 : -1)
            )
            // equivalent:
            /* (()=>{ const halfWay = filteredWoSort
              .sort((a, b) =>
              sortObj[filters.sort.slice(0, -1)](a, b))
              return filters.sort.slice(-1) === "-"  ? halfWay.reverse() : halfWay;
            })()
            */
             : filteredWoSort;

        return final;
      });

      isFiltering && setTimeout(() => setIsFiltering(false), 150);
      setTimeout(() => setShouldRender(true), 51);
      setState("filtered");
    }
  }, [state]);


  useEffect(() => {

    if (!isLoading && ["fetched", "filtered"].includes(state)) {
      setShouldRender(false);
      if (filters.channel || filters.duration || filters.sort) {
        
        setSearchParams({
          [isPlaylistId ? "id" : "url"]: inputUrl,
          ...((filters.channel || filters.duration || filters.sort) && { filters: true }),
          ...(filters.channel && { channel: filters.channel }),
          ...(filters.duration && { duration: filters.duration }),
          ...(filters.sort && { sort: filters.sort }),
        });
        setIsFiltering(true);
        setState("filtering");
      } else {
        setIsFiltering(true);

        setSearchParams({
          [isPlaylistId ? "id" : "url"]: inputUrl,
        });

        setCurrentItems(data);
        setTimeout(() => setIsFiltering(false), 50);

        setTimeout(() => setShouldRender(true), 51);
      }
    }
  }, [filters.channel, filters.duration, filters.sort]);

  useEffect(() => {
    processRequest();
  }, [searchParams.get("id"), searchParams.get("url")]);


  return (
    <>
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
        <Header />
        <InputComponent
          inputUrl={inputUrl}
          submitHandler={submitHandler}
          setInputUrl={setInputUrl}
          isLoading={isLoading}
          isPlaylistId={isPlaylistId}
          isInvalidUrl={isInvalidUrl}
          isFiltering={isFiltering}
        />

        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {(isLoading || processingDuration) && <Loader />}
          {validReq && (
            <>
              {totalDuration > 0 && (
                <TotalDurationComp totalDuration={totalDuration} />
              )}

              {totalDuration > 0 && (
                <div
                  style={{
                    borderTop: "1px solid rgba(128,128,128,0.5)",
                    marginBottom: "20px",
                    width: "100%",
                  }}
                ></div>
              )}
            </>
          )}

          {state === "initial" && <Welcome />}

          {validReq && (
            <>
              {!isLoading && data.length > 0 && (
                <Filters
                  channelsList={channelsList}
                  durationsList={durationsObjList}
                  sortList={sortList}
                  setFilters={setFilters}
                  isFiltering={isFiltering}
                  initial={
                    // required: If both params exist but the filers is off, then what to do huh?
                    filters.status
                      ? {
                          duration: searchParams.get("duration"),
                          channel: searchParams.get("channel"),
                          sort: searchParams.get("sort"),
                        }
                      : { duration: null, channel: null, sort: null }
                  }
                  classes={["anim-default", "filters-wrapper"]}
                />
              )}

              {state === "error" && <Error isPlaylistId={isPlaylistId} />}
              {Object.keys(playlistInfo).length > 0 && (
                <PlaylistInfoComp
                  playlistInfo={playlistInfo}
                  classes={["anim-default"]}
                />
              )}

              {data.length > 0 && isFiltering && (
                <div
                  style={{
                    color: "grey",
                    fontSize: "44px",
                    fontWeight: "bolder",
                    textAlign: "center",
                    width: "100%",
                    padding: "25px 0px",
                    marginTop: "20px",
                  }}
                  className="font-Montserrat anim-default"
                >
                  Filtering Data....
                </div>
              )}

              {data.length > 0 &&
                !isLoading &&
                shouldRender && (
                  <>
                    <div
                      style={{
                        display: "grid",
                        marginTop: "10px",
                        marginBottom: "10px",
                        marginLeft: "-15px",
                        marginRight: "-15px",
                        width: "100%",
                        justifyContent: "center",
                        animationDelay: "0.3s",
                        position: "relative",
                      }}
                      className="anim-default wrapper-grid"
                    >
                      {currentItems
                        ?.map((i) => ({
                          ...i,
                          ...((!i.desciption || i.desciption?.length === 0) && {
                            desciption: null,
                          }),
                        }))
                        .map((i, idx) => (
                          <ItemCard
                            Item={i}
                            key={i.videoId + i.position}
                            playlistId={playlistInfo.playlistId}
                            idx={idx}
                          />
                        ))}
                    </div>
                    {currentItems.length === 0 && (
                      <div
                        style={{
                          color: "grey",
                          fontSize: "44px",
                          fontWeight: "bolder",
                          textAlign: "center",
                          width: "100%",
                          padding: "25px 0px",
                          marginTop: "20px",
                        }}
                        className="font-Montserrat anim-default"
                      >
                        Nothing to Display !
                      </div>
                    )}
                  </>
                )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

const InputComponent = ({
  inputUrl,
  submitHandler,
  setInputUrl,
  isLoading,
  isPlaylistId,
  isInvalidUrl,
  isFiltering,
}) => (
  <>
    <div style={{ borderTop: "1px solid rgba(128,128,128,0.5)" }}></div>
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
        {inputUrl.length === 0
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
        name=""
        id=""
        style={{
          fontSize: "15px",
          letterSpacing: "0.7px",
          color: "rgba(79, 77, 77, 1)",
          padding: "8px 10px",
          border: "1px rgba(128,128,128,0.5) solid",
        }}
        placeholder="Enter Playlist ID / URL"
        onChange={(e) => setInputUrl(e.target.value.trim())}
        spellCheck="false"
        autoComplete="off"
        value={inputUrl}
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
        onClick={submitHandler}
        disabled={(!isPlaylistId && isInvalidUrl) || isLoading || !!isFiltering}
      >
        Go
      </button>
    </section>
    <div style={{ borderTop: "1px solid rgba(128,128,128,0.5)" }}></div>
  </>
);

export default App;
