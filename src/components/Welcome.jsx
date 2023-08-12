import React from 'react'

const Welcome = () => {

    return (
        <div className='jumbotron anim-default' style={{ backgroundColor: 'rgba(98, 222, 143, 0.3)', color: 'rgba(0, 57, 21, 0.9)', borderRadius: '6px', padding: '20px 20px', marginTop: '40px' }}>
            <h3 className='font-Montserrat' style={{ fontSize: '24px', fontWeight: 550, letterSpacing: "1.2px", textAlign: 'center' }}>Hey!</h3>
            <p style={{ textAlign: 'center', fontFamily: 'sans-serif', letterSpacing: '0.7px' }}>This app helps you to calculate the total duration of a YouTube playlist.
            </p>
            <p style={{ textAlign: 'center', fontFamily: 'sans-serif', letterSpacing: '0.7px' }}>Just paste the URL above and hit Go.
            </p>

            <div style={{ borderTop: '1px solid rgba(128,128,128,0.5)', maxWidth: '90%', margin: '40px auto' }}></div>


            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif', }}>
                <a href="http://github.com/visheshism/Yt-Playlist-Length-Calc" target="_blank" style={{ textDecoration: 'none', fontFamily: 'inherit', color: 'inherit' }}>Source</a>
                <div>
                    Made by&nbsp;
                    <a href="http://github.com/visheshism" target="_blank" style={{ textDecoration: 'none', fontFamily: 'sans-serif', color: 'inherit' }}>Vishesh Singh</a>.
                </div>
            </div>
        </div>
    )
}

export default Welcome