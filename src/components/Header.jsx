import React from 'react'

const Header = () => {
    return (
        <>
            <header style={{ display: 'flex', flexGrow: 1, flexShrink: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: "18px 0" }}>

                <div style={{ minWidth: '50px', width: '10%', maxWidth: '80px', marginRight: '20px' }}>

                    <img src='/logo.png' style={{ width: '100%' }} />
                </div>
                <div style={{ width: '100%' }}>

                    <h3 className='font-Montserrat' style={{ fontSize: '26px', fontWeight: 550, letterSpacing: "1.2px", wordBreak: "break-word", textAlign: 'center' }}>YT Playlist Length Calculator</h3>
                </div>

            </header>
        </>
    )
}

export default Header