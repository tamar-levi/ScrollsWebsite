import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import LoginDialog from './LoginDialog';
import background from '../assets/Bacg.png';
import About from './About';
import Contact from './Contact';
import { createGlobalStyle } from 'styled-components';
import { useScroll } from '../context/ScrollContext';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    overflow-x: hidden;
  }
`;

const HomePage = () => {
  const { aboutRef, contactRef } = useScroll();
  const [openLogin, setOpenLogin] = useState(false);
  const handleOpenLogin = () => {
    setOpenLogin(true);
  };
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  return (
    <>
      <GlobalStyle />
      <div
        className="relative"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(${background})`,
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "max(10px, 8%)",
            bottom: "28%",
            fontFamily: "'Heebo', sans-serif",
            color: "#212121",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: 'right',
            maxWidth: "100%",
            whiteSpace: "nowrap",
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(3rem, 5vw, 3.6rem)',
                  fontWeight: '900',
                  color: '#7A5950',
                  fontFamily: 'Heebo',
                  lineHeight: '85%',
                }}
              >
                לוח המגילות
              </div>
              <div style={{ color: "#5A3B41", fontSize: '1.7rem' }}>
                <span style={{ fontWeight: 400 }}>המקום למגילה משלך </span>
                <span style={{ fontWeight: 700 }}>בקלות</span>
              </div>
            </div>
            <div style={{ color: "#5A3B41", fontSize: '1.3rem', marginRight: "4%", marginTop: "10%", lineHeight: '120%' }}>
              <span style={{marginLeft: '-2%'}}>בלוח המגילות תמצאו בקלות ובנוחות</span>
              <br/>
              <span>,</span>
              <span>מגילות אסתר כלבבכם</span>
              <br/>
              <span>.</span>
              <span style={{ fontWeight: "bolder" }}>באיכות ובהידור שאתם מחפשים</span>
            </div>
          </div>
          <Button
            variant="contained"
            onClick={handleOpenLogin}
            sx={{
              marginTop: '8%',
              backgroundColor: 'rgba(90, 59, 65, 1)',
              color: 'white',
              padding: '0 30%',
              borderRadius: '50px',
              '&:hover': {
                backgroundColor: 'rgba(90, 59, 65, 1)'
              },
              fontFamily: 'Heebo, sans-serif',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            התחברות
          </Button>
        </div>
        {openLogin && (
          <LoginDialog
            open={openLogin}
            onClose={handleCloseLogin}
          />
        )}
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={contactRef}>
        <Contact />
      </div>
    </>
  );
};

export default HomePage;
