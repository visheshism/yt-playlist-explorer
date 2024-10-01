import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import MoreInfoModal from "./components/Wrapper/components/MoreInfoModal/Index";
import Container from "./components/Container/Index";
import Header from "./components/Header/Index";
import SearchBar from "./components/SearchBar/Index";
import Error from "./components/StateComponents/Error/Index";
import Welcome from "./components/StateComponents/Welcome/Index";
import Wrapper from "./components/Wrapper/Index";
import {
  filtersChangeHandler,
  getData,
  processingDurationToggleHandler,
  stateChangeHandler,
} from "./utils";
export const ctx = createContext({});

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const paramId = searchParams.get("id");
  const paramUrl = searchParams.get("url");
  const validReq = paramId || paramUrl;

  const [inputValue, setInputValue] = useState((paramId || paramUrl) ?? "");
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

  const [isFiltering, setIsFiltering] = useState(false);

  const playlistIdRegExp = /^[a-zA-Z0-9_-]{12,}$/;
  const isPlaylistId = playlistIdRegExp.test(inputValue);

  const isInvalidUrl = useMemo(
    () =>
      (!inputValue.startsWith("https://youtube.com/playlist?list=") &&
        !inputValue.startsWith("https://www.youtube.com/playlist?list=") &&
        !inputValue.startsWith("www.youtube.com/playlist?list=")) ||
      !inputValue.split("youtube.com/playlist?list=")[1],
    [inputValue]
  );

  // Static filter's values
  const durationsObjList = [
    { text: "5 min", value: `lt-${5 * 60}` },
    { text: "40 min", value: `gt-${40 * 60}` },
  ];
  const durationsList = durationsObjList.map(({ value }) => value);
  const sortList = ["Video Added", "Duration", "Video Published"];

  const prevInputValue = useRef(inputValue); // To avoid collisons in searchbar and identify current state of searchbar

  const submitHandler = () => {
    prevInputValue.current = inputValue;
    setSearchParams({ [isPlaylistId ? "id" : "url"]: inputValue });
  };

  const processRequest = () => {
    if (validReq) {
      setIsLoading(true);
      setProcessingDuration(false);
      setState("fetching");

      document.title = `YouTube Playlist Explorer`;
      setPlaylistInfo({});
      setData([]);
      setTotalDuration(0);

      getData(inputValue, "", {
        inputValue,
        isPlaylistId,
        setState,
        setData,
        setPlaylistInfo,
        setProcessingDuration,
        setCurrentItems,
      });
    }
  };

  // Handle change in processingDuration boolean
  useEffect(() => {
    processingDurationToggleHandler({
      setState,
      data,
      setData,
      filters,
      setFilters,
      setIsLoading,
      durationsList,
      sortList,
      processingDuration,
      setProcessingDuration,
      searchParams,
      setSearchParams,
      setShouldRender,
      setChannelsList,
      setTotalDuration,
      setCurrentItems,
    });
  }, [processingDuration]);

  // Handle change in state
  useEffect(() => {
    stateChangeHandler({
      state,
      setIsLoading,
      setCurrentItems,
      data,
      filters,
      isFiltering,
      setIsFiltering,
      setShouldRender,
      setState,
    });
  }, [state]);

  // Handle change in filters
  useEffect(() => {
    filtersChangeHandler({
      state,
      setState,
      inputValue,
      isPlaylistId,
      data,
      filters,
      isLoading,
      setCurrentItems,
      setShouldRender,
      setSearchParams,
      setIsFiltering,
    });
  }, [filters.channel, filters.duration, filters.sort]);

  // Handle change in search params
  useEffect(() => {
    if (isPlaylistId || !isInvalidUrl) {
      processRequest();
    }
  }, [searchParams.get("id"), searchParams.get("url")]);

  const [modal, setModalProps] = useState({
    show: false,
    data: null,
  });

  return (
    <ctx.Provider
      value={{
        setModalProps,
        isFiltering,
        setFilters,
        channelsList,
        durationsObjList,
        sortList,
        filters,
        searchParams,
      }}
    >
      {/* More Information Modal */}
      {modal.show && (
        <MoreInfoModal
          data={modal.data}
          closeModal={() => setModalProps(() => ({ data: null, show: false }))}
        />
      )}

      <Container>
        <Header />

        <SearchBar
          {...{
            inputValue,
            submitHandler,
            setInputValue,
            isLoading,
            isPlaylistId,
            isInvalidUrl,
            isFiltering,
            prevInputValue,
          }}
        />

        {state === "initial" && <Welcome />}

        {state === "error" && <Error isPlaylistId={isPlaylistId} />}

        <Wrapper
          {...{
            validReq,
            isLoading,
            processingDuration,
            playlistInfo,
            totalDuration,
            dataLength: data.length,
            isFiltering,
            shouldRender,
            currentItems,
          }}
        />
      </Container>
    </ctx.Provider>
  );
}

export default App;
