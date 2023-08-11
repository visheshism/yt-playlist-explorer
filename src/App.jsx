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


  const getData = async (url, nextPage) => {

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
      <div className="container">

        <Header />
        <InputComponent inputUrl={inputUrl} submitHandler={submitHandler} setInputUrl={setInputUrl} isLoading={isLoading} />

        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {(isLoading || processingDuration) && <Loader />}
          {totalDuration > 0 && <TotalDurationComp totalDuration={totalDuration} />}

        </main>

        {totalDuration > 0 && (<div style={{ borderTop: '1px solid rgba(128,128,128,0.5)' }}></div>)}

        {(state === "initial") && <Welcome state={state} />}
        {(state === "error") && <Error />}

        {Object.keys(playlistInfo).length > 0 && (<PlaylistInfoComp playlistInfo={playlistInfo} />)}


        {data.length > 0 && (<div style={{
          display: 'flex',
          marginTop: '10px', marginBottom: '10px',
          marginLeft: '-15px', marginRight: '-15px',
          flexWrap: 'wrap'
        }}>
          {data.map(i => (<ItemCard Item={i} key={i.videoId + i.position} />))}
        </div>)}

      </div>
    </>
  )
}


const InputComponent = ({ inputUrl, submitHandler, setInputUrl, isLoading }) => (<>
  <div style={{ borderTop: '1px solid rgba(128,128,128,0.5)' }}></div>
  <section style={{ display: "grid", width: '100%', gridTemplateColumns: '8% 1fr 8%', padding: '50px 0' }}>
    <button style={{ padding: '8px', background: 'rgba(128,128,128,0.16)', border: '1.5px rgba(128,128,128,0.2) solid', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', color: 'rgba(79, 77, 77, 1)', fontSize: '15px', letterSpacing: '0.5px' }} >URL</button>
    <input type="url" className='urlInput' name="" id="" style={{ fontSize: '15px', letterSpacing: '0.7px', color: 'rgba(79, 77, 77, 1)', padding: '8px 10px', border: '1px rgba(128,128,128,0.5) solid' }}
      placeholder='https://www.youtube.com/playlist?list=PLMC9KNkIncKtGvr2kFRuXBVmBev6cAJ2u'
      onChange={(e) => setInputUrl(e.target.value.trim())} spellCheck="false" autoComplete="off"
      value={inputUrl}
    />
    <button className='submit_btn' style={{ padding: '8px', background: 'none', border: '1.5px rgba(222, 10, 10, 1) solid', borderTopRightRadius: '4px', borderBottomRightRadius: '4px', color: 'rgba(222, 10, 10, 1)', fontSize: '15px', letterSpacing: '0.5px', transition: 'all 0.2s' }} onClick={submitHandler}
      disabled={!inputUrl.includes("youtube.com/playlist?list=") || !inputUrl.split('youtube.com/playlist?list=')[1] || isLoading}
    >Go</button>

  </section>
  <div style={{ borderTop: '1px solid rgba(128,128,128,0.5)', }}></div>
</>
)

export default App
