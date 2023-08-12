import { useEffect, useState } from 'react'
import "./App.css"
import { getListItems, getPlaylistInfo, getVideoDuration } from './api'
import Header from './components/Header';
import Welcome from './components/Welcome';
import Error from './components/Error';
import PlaylistInfoComp from './components/Wrapper/PlaylistInfo';
import ItemCard from './components/Wrapper/ItemCard';
import TotalDurationComp from './components/Wrapper/TotalDuration';
import Loader from './components/Loader';


function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [playlistInfo, setPlaylistInfo] = useState({})
  const [data, setData] = useState([]);
  const [processingDuration, setProcessingDuration] = useState(false)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [state, setstate] = useState('initial')

  const playlistIdRegExp = /^[a-zA-Z0-9_-]{12,}$/
  const isPlaylistId = playlistIdRegExp.test(inputUrl)

  const getData = async (url, nextPage) => {

    if (isPlaylistId) url = `https://youtube.com/playlist?list=${inputUrl}`

    const searchParams = new URLSearchParams(url.split('?')[1])
    const playListId = searchParams.get('list');

    if (playListId.length > 1) {
      const PlaylistInfo = await getPlaylistInfo(playListId);
      setPlaylistInfo(PlaylistInfo)

      if (Object.keys(PlaylistInfo).length > 0) {

        const playlistData = await getListItems(playListId, nextPage)

        setData(prev => [...prev, ...playlistData.items])

        const { nextPageToken } = playlistData


        if (nextPageToken) {
          return getData(url, nextPageToken)
        }

        setProcessingDuration(true)
      } else {
        setstate('error')
      }
    } else {
      setstate('error')
    }
  }

  const submitHandler = () => {

    setIsLoading(true)
    setProcessingDuration(false)
    setstate('fetching')

    setPlaylistInfo({})
    setData([]);
    setTotalDuration(0)

    getData(inputUrl)
  }

  useEffect(() => {
    const setDuration = async () => {
      const durationData = await getVideoDuration(data)

      const updatedData = data.map((item, idx) => ({
        ...item,
        ide: idx,
        duration: durationData[item.videoId] ?? 0
      }))

      setData([...updatedData])

      setTotalDuration(updatedData.filter(i => i.duration).map(i => Number(i.duration)).reduce((total, num) => total + num, 0))

      setProcessingDuration(false)
      setIsLoading(false)
      setstate('fetched')
    }

    if (processingDuration && data.length > 0) {
      setDuration()
    }
  }, [processingDuration])


  useEffect(() => {
    if (state === "error") {
      setIsLoading(false)
    }
  }, [state])

  return (
    <>
      <div className="container" style={{
        width: '100%',
        paddingRight: '15px',
        paddingLeft: '15px',
        marginRight: 'auto',
        marginLeft: 'auto'
      }}>

        <Header />
        <InputComponent inputUrl={inputUrl} submitHandler={submitHandler} setInputUrl={setInputUrl} isLoading={isLoading} isPlaylistId={isPlaylistId} />

        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {(isLoading || processingDuration) && <Loader />}
          {totalDuration > 0 && <TotalDurationComp totalDuration={totalDuration} />}


          {totalDuration > 0 && (<div style={{ borderTop: '1px solid rgba(128,128,128,0.5)', marginBottom: '20px', width: '100%' }}></div>)}

          {(state === "initial") && <Welcome />}
          {(state === "error") && <Error isPlaylistId={isPlaylistId} />}

          {Object.keys(playlistInfo).length > 0 && (<PlaylistInfoComp playlistInfo={playlistInfo} classes={['anim-default']} />)}


          {data.length > 0 && (<div style={{
            display: 'flex',
            marginTop: '10px', marginBottom: '10px',
            marginLeft: '-15px', marginRight: '-15px',
            flexWrap: 'wrap', width: '100%', animationDelay: '0.3s'
            }} className='anim-default'>
            {data.map(i => (<ItemCard Item={i} key={i.videoId + i.position} playlistId={playlistInfo.playlistId} />))}
          </div>)}


        </main>



      </div>
    </>
  )
}


const InputComponent = ({ inputUrl, submitHandler, setInputUrl, isLoading, isPlaylistId }) => (<>
  <div style={{ borderTop: '1px solid rgba(128,128,128,0.5)' }}></div>
  <section style={{ display: "grid", width: '100%', gridTemplateColumns: '14% 1fr 12%', padding: '50px 0' }}>
    <button style={{ padding: '8px', background: 'rgba(128,128,128,0.16)', border: '1.5px rgba(128,128,128,0.2) solid', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', color: 'rgba(79, 77, 77, 1)', fontSize: '15px', letterSpacing: '0.5px' }} >{isPlaylistId ? "ID" : "URL"}</button>
    <input type="url" className='urlInput' name="" id="" style={{ fontSize: '15px', letterSpacing: '0.7px', color: 'rgba(79, 77, 77, 1)', padding: '8px 10px', border: '1px rgba(128,128,128,0.5) solid' }}
      placeholder='Enter Playlist ID / URL'
      onChange={(e) => setInputUrl(e.target.value.trim())} spellCheck="false" autoComplete="off"
      value={inputUrl}
    />
    <button className='submit_btn' style={{ padding: '8px', background: 'none', border: '1.5px rgba(222, 10, 10, 1) solid', borderTopRightRadius: '4px', borderBottomRightRadius: '4px', color: 'rgba(222, 10, 10, 1)', fontSize: '15px', letterSpacing: '0.5px', transition: 'all 0.2s' }} onClick={submitHandler}
      disabled={(!isPlaylistId && (!inputUrl.includes("youtube.com/playlist?list=") || !inputUrl.split('youtube.com/playlist?list=')[1])) || isLoading}
    >Go</button>

  </section>
  <div style={{ borderTop: '1px solid rgba(128,128,128,0.5)', }}></div>
</>
)

export default App
