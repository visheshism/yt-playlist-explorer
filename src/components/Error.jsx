import React from 'react'

const Error = () => {
  return (
    <div className='jumbotron anim-default' style={{ backgroundColor: 'rgba(239, 102, 102, 0.4)', color: 'rgba(138, 4, 4, 0.84)', borderRadius: '6px', padding: '20px 20px', marginTop: '40px' }}>
      <h3 className='font-Montserrat' style={{ fontSize: '24px', fontWeight: 550, letterSpacing: "1.2px", textAlign: 'center' }}>Not Found!</h3>
      <p style={{ textAlign: 'center', fontFamily: 'sans-serif', letterSpacing: '0.7px' }}>Couldn't find any Youtube playlist with the given url.
      </p>
      <p style={{ textAlign: 'center', fontFamily: 'sans-serif', letterSpacing: '0.7px' }}>Please check the url and try again.
      </p>

      <div style={{ borderTop: '1px solid rgba(138, 4, 4, 0.4)', maxWidth: '90%', marginTop: '40px', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto' }}></div>



    </div>
  )
}

export default Error