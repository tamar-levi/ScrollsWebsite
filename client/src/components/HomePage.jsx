import React, { useState } from 'react';
import Button from '@mui/material/Button';
import LoginDialog from './LoginDialog';
import backgroundImage from '../assets/backgroundImage.png';

const HomePage = () => {
  const styles = {
    body: {
      overflow: "hidden",
      margin: 0,
      padding: 0
    }
  };

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
        // backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        height: "calc(100vh - 64px)",
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
        position: "fixed",

      }}
    >
      <div
        className="bg-white/70 rounded-2xl p-8 shadow-xl z-10"
        style={{
          padding: "40px",
          marginTop: "10vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          onClick={handleOpenLogin}
          sx={{
            fontSize: "1.2rem",
            padding: "12px 30px",
            borderRadius: "12px",
            alignSelf: "center",
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
