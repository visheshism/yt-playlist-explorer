import { getTimeString } from "../../utils/timeConversion"

const ItemCard = ({ Item: { title, description, duration = 0, videoId, position: idx, image = '/img/not-found.2056c908.png' } }) => {

    return (<article className='itemCard' style={{
        paddingLeft: '15px', paddingRight: '15px', marginTop: '3rem'
    }}>
        <div style={{ border: '1px rgba(128,128,128,0.3) solid', borderRadius: '6px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

            <img src={`${image}`} alt={title} style={{ width: '100%', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', flexShrink: 0 }} />

            <div style={{ padding: '10px 20px', textAlign: 'center', marginBottom: '15px' }}>

                <h3 className='text-truncate' style={{ fontFamily: 'sans-serif', margin: '6px 0', fontSize: '24px', fontWeight: 600 }}>
                    {!isNaN(idx) ? idx + 1 + '.' : ''} {title}
                </h3>

                <h4 className='font-Montserrat' style={{ color: 'rgba(128,128,128,1)', fontWeight: 550, letterSpacing: '0.6px', margin: 0, margin: '6px 0', fontSize: '14px' }}>{getTimeString(duration)}</h4>

                <p className='text-truncate' style={{ width: '100%', margin: '10px 0', fontFamily: 'sans-serif', letterSpacing: '0.5px', marginBottom: '20px' }}>{description}</p>

                <a href={`https://youtube.com/watch?v=${videoId}`} style={{ padding: '10px', borderRadius: '4px', border: 'none', background: 'rgba(54, 130, 233, 1)', color: 'white', fontFamily: 'sans-serif', letterSpacing: '0.8px', textDecoration: 'none' }} target="__blank">Watch Video</a>

            </div>

        </div>

    </article>)
}

export default ItemCard