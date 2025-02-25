import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import LoginDialog from './LoginDialog';
import background from '../assets/Background.jpg';
const HomePage = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, []);

  const [openLogin, setOpenLogin] = useState(false);

  const handleOpenLogin = () => {
      setOpenLogin(true); 
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  return (
    <div
      className="relative"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundImage: `url(${background})`,
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        right: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "max(10px, 10%)", 
          bottom: "25%",
          fontFamily: "'Rubik', sans-serif",
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
          <div style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", fontWeight: "bold" }}>לוח</div>
          <div style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: "600" }}>המגילות</div>
          <div style={{ fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: "500" }}>והסת"ם</div>
        </div>
        <Button
          variant="contained"
          onClick={handleOpenLogin}
          sx={{
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "5px",
            marginTop: "25px",
            marginRight: "-25%",
            width: "max-content",
            fontFamily: "'Rubik', sans-serif",
            fontSize: "1rem", 
            lineHeight: "normal",
            minHeight: "unset",
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
  );
};

export default HomePage;
