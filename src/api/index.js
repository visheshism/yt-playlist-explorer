import Axios from "axios"
import { iso8601ToTime } from "../utils/timeConversion"

const API_KEY = import.meta.env.VITE_API_KEY

export const getPlaylistInfo = async (PlaylistId) => {
    try {

        const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&fields=items(snippet(title,description))&key=${API_KEY}&id=${PlaylistId}`

        const response = await Axios.get(url)
        const { data: { items: [{ snippet: { title, description } }] } } = response

        return { title, description, playlistId: PlaylistId }
    } catch (error) {
        return {}
    }
}

export const getListItems = async (playlistId, nextPage = '') => {
    try {

        const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&fields=nextPageToken,items(snippet(title,description,thumbnails(medium),position,resourceId(videoId)))&maxResults=50&key=${API_KEY}&pageToken=${nextPage}`

        const response = await Axios.get(url)
        const { data: { nextPageToken, items } } = response
        const videoItems = items.map(({ snippet: { title, description, position, resourceId: { videoId }, thumbnails: { medium: { url: ImageUrl } = { url: undefined } } } }) => ({ title, ...(description.length > 0 ? { description } : { description: null }), videoId, position, image: ImageUrl }))

        return { nextPageToken, items: videoItems }
    } catch (error) {
        return { items: [] }
    }
}


export const getVideoMetaData = async (items) => {
    const arr = []
    let collection = []

    let i = 0
    while (i < Math.ceil(items.length / 50)) {
        collection[i] = items.map(i => i.videoId).slice(i * 50, (i + 1) * 50)

        i++
    }

    for (const chunk of collection) {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&fields=items(id,snippet(channelTitle),contentDetails(duration))&key=${API_KEY}&id=${chunk.join(",")}`
        const response = await Axios.get(url)
        const { data: { items } } = response
        arr.push(...items)
    }

    const durationsObj = arr.reduce((final, currentItem) => {
        const { id, contentDetails: { duration } = { duration: "" } } = currentItem;
        final[id] = iso8601ToTime(duration);
        return final;
    }, {});

const channelsObj = arr.reduce((final, currentItem) => {
    const { id, snippet: { channelTitle } = { channelTitle: "" } } = currentItem

    final[id] = channelTitle

    // console.log(channelTitle)
    return final
  }, {})

    return [durationsObj, channelsObj]
}
