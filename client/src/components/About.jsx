import * as React from 'react';
import { Box, Container, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import background from '../assets/AboutOur.jfif';
import image from '../assets/About.png';
import { Link } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    overflow-x: hidden;
  }
`;

export default function About() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      <GlobalStyle />
      <Box sx={{
        direction: 'rtl',
        padding: isMobile ? '20px 0' : '30px 0',
        position: 'relative',
        minHeight: "100vh",
        width: "100vw",
        display: 'flex',
        alignItems: 'center',
        marginLeft: '-8px',  
        marginRight: '-8px',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: isMobile ? 'center' : 'flex-start',
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.52,
          zIndex: 0,
          width: '100%',
          height: '100%',
        }} />

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: isMobile ? '90%' : isTablet ? '40%' : '30%',
          marginRight: isMobile ? '0' : isTablet ? '5%' : '12%',
          marginBottom: isMobile ? '30px' : '0',
          marginTop: isMobile ? '20px' : '0',
          zIndex: 2,
          position: 'relative',
        }}>
          <Typography
            sx={{
              marginBottom: isMobile ? '30px' : '50px',
              background: '#E6DBC9',
              borderRadius: '39px',
              color: 'rgba(90, 59, 65, 1)',
              fontFamily: 'Heebo, sans-serif',
              fontWeight: 'bold',
              padding: isMobile ? '8px 30px' : '0.5% 15%',
              fontSize: isMobile ? '1rem' : '1.2rem',
              display: 'inline-block',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            אז מי אנחנו?
          </Typography>
          
          <Box sx={{
            width: '100%',
            height: isMobile ? '200px' : '250px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '15px',
          }} />
          
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                marginTop: isMobile ? '30px' : '50px',
                backgroundColor: '#47515A',
                color: 'white',
                padding: isMobile ? '8px 30px' : '0 50px',
                borderRadius: '50px',
                '&:hover': {
                  backgroundColor: '#373F47'
                },
                fontFamily: 'Heebo, sans-serif',
                fontWeight: 'bold',
                fontSize: isMobile ? '1rem' : '1.2rem',
                whiteSpace: 'nowrap',
              }}
            >
              אני רוצה לקנות
            </Button>
          </Link>
        </Box>

        <Container maxWidth="lg" sx={{
          flex: 1,
          position: 'relative',
          zIndex: 2,
          fontFamily: 'Heebo, sans-serif',
          color: 'rgb(39, 21, 37)',
          lineHeight: '1.5',
          paddingRight: isMobile ? '15px' : isTablet ? '15%' : '30%',
          paddingLeft: isMobile ? '15px' : 'inherit',
          marginRight: isMobile ? '0' : isTablet ? '3%' : '7%',
          marginLeft: isMobile ? '0' : isTablet ? '3%' : '13%',
          fontSize: isMobile ? '0.9rem' : '1.2rem',
          textAlign: isMobile ? 'center' : 'right',
        }}>
          מיזם ייחודי וייעודי לפרסום מגילות אסתר ושאר כתבי סת"ם,<br />
          הלוח נועד לפרסם בתפוצה רחבה מאד מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה הן למעונינים לרכוש והן לסופרי הסת"ם המעוניינים למכור,<br />
          בלוח המגילות תמצאו בקלות ובנוחות מגילת אסתר כלבבכם, מתוך מגוון ענק של כל סוגי מגילות אסתר ולפי כל המנהגים, בטווח מחירים גדול, ובאיכות ובהידור שאתם מחפשים,<br />
          בלוח המגילות מפרסמים טובי הסופרים את היצירות שלהם,<br />
          הלוח מפנה אותך באופן ישיר אל הסופר, בכך תוכל להתרשם מהסופר באופן אישי ולשמוע את כל הפרטים על המגילה שלו, על רמת ההידור וההקפדה החל מבחירת הקלף הדיו והכתיבה עצמה, וכלה בהגהה ותיקון.<br />
          <span style={{ 
            fontWeight: 'bold', 
            color: 'rgba(90, 59, 65, 1)',
            display: 'block',
            marginTop: isMobile ? '10px' : '0'
          }}>
            בלוח המגילות תרכשו את המגילה ישר מהסופר, ללא פערי תיווך כלל, ובהתרשמות אישית ובשיח פתוח מול הסופר עצמו.
          </span>
        </Container>
      </Box>
    </>
  );
}
