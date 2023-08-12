import React from 'react'

const PlaylistInfoComp = ({ classes, playlistInfo: { title, description } }) => {
    return (<div className={classes.join(' ')} style={{ width: '100%' }}>
        <h3 className='font-Montserrat' style={{ width: '100%', textAlign: 'center', fontSize: '26px', fontWeight: 550, padding: '10px 0' }}>{title}</h3>
        <p className='text-truncate font-Montserrat' style={{ width: '100%', margin: '10px 0', letterSpacing: '0.8px', marginBottom: '20px', textAlign: 'center', padding: '0 40px' }}>{description}</p>
    </div>
    )
}

export default PlaylistInfoComp