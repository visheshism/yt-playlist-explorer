import { getListItems, getPlaylistInfo, getVideoMetaData } from "../api";

export const getData = async (url, nextPage, reqs) => {
  const {
    inputValue,
    isPlaylistId,
    setState,
    setData,
    setPlaylistInfo,
    setProcessingDuration,
    setCurrentItems,
  } = reqs;

  if (isPlaylistId) url = `https://youtube.com/playlist?list=${inputValue}`;

  const searchParams = new URLSearchParams(url.split("?")[1]);
  const playListId = searchParams.get("list");

  if (playListId.length > 1) {
    const PlaylistInfo = await getPlaylistInfo(playListId);
    setPlaylistInfo(PlaylistInfo);

    if (Object.keys(PlaylistInfo).length > 0) {
      document.title = `${PlaylistInfo.title} - YouTube Playlist Explorer`;

      const playlistData = await getListItems(playListId, nextPage);

      setData((prev) => {
        setCurrentItems((prev1) => [...prev1, ...playlistData.items]);
        return [...prev, ...playlistData.items];
      });

      const { nextPageToken } = playlistData;

      if (nextPageToken) {
        return getData(url, nextPageToken, reqs);
      }

      setProcessingDuration(true);
    } else {
      setState("error");
    }
  } else {
    setState("error");
  }
};

export const stateChangeHandler = (reqs) => {
  const {
    state,
    setIsLoading,
    setCurrentItems,
    data,
    filters,
    isFiltering,
    setIsFiltering,
    setShouldRender,
    setState,
  } = reqs;

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
        : // equivalent:
          /* (()=>{ const halfWay = filteredWoSort
                .sort((a, b) =>
                sortObj[filters.sort.slice(0, -1)](a, b))
                return filters.sort.slice(-1) === "-"  ? halfWay.reverse() : halfWay;
              })()
              */
          filteredWoSort;

      return final;
    });

    isFiltering && setTimeout(() => setIsFiltering(false), 150);
    setTimeout(() => setShouldRender(true), 51);
    setState("filtered");
  }
};

export const filtersChangeHandler = (reqs) => {
  const {
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
  } = reqs;

  if (!isLoading && ["fetched", "filtered"].includes(state)) {
    setShouldRender(false);
    if (filters.channel || filters.duration || filters.sort) {
      setSearchParams({
        [isPlaylistId ? "id" : "url"]: inputValue,
        ...((filters.channel || filters.duration || filters.sort) && {
          filters: true,
        }),
        ...(filters.channel && { channel: filters.channel }),
        ...(filters.duration && { duration: filters.duration }),
        ...(filters.sort && { sort: filters.sort }),
      });
      setIsFiltering(true);
      setState("filtering");
    } else {
      setIsFiltering(true);

      setSearchParams({
        [isPlaylistId ? "id" : "url"]: inputValue,
      });

      setCurrentItems(data);
      setTimeout(() => setIsFiltering(false), 50);

      setTimeout(() => setShouldRender(true), 51);
    }
  }
};

export const processingDurationToggleHandler = (reqs) => {
  const {
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
  } = reqs;

  const setDuration = async () => {
    return new Promise((resolve, reject) => {
      try {
        resolve(
          (async () => {
            const [
              durationData,
              channelsData,
              publishDtTiObj,
              statsData,
              tagsData,
            ] = await getVideoMetaData(data);

            const updatedData = data.map((item, idx) => ({
              ...item,
              ide: idx,
              duration: durationData[item.videoId] ?? 0,
              channel: channelsData[item.videoId] ?? "",
              stats: statsData[item.videoId],
              tags: tagsData[item.videoId],
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
              ...[...searchParams]
                .filter(
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
                )
                .reduce((acc, cur) => {
                  const [key, value] = cur;
                  acc[key] = value;
                  return acc;
                }, {}),
            });

            /* equivalent: 
                        setSearchParams({
                          [isPlaylistId ? "id" : "url"]: inputValue,
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
                !(prev.channel && channelListFromData.includes(prev.channel)) &&
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
};
