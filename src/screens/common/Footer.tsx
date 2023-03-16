import React from 'react'


function Footer() {
    return (
        <footer className="footer" style={{
            height: '119px', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', fontSize: '1rem' ,
            backgroundColor:"rgb(250, 250, 250)"
        }}>
            <p style={{
                color: 'gray',
                fontSize: '14px'
            }}>© 2023 INSTAGRAM FROM META</p>
        </footer>
    )
}

export default Footer
