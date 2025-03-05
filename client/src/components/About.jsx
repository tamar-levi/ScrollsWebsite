import * as React from 'react';
import { Box, Container, Button, Typography } from '@mui/material';
import background from '../assets/AboutOur.jfif';
import image from '../assets/About.png';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <Box sx={{
      direction: 'rtl',
      padding: '30px 0',
      position: 'relative',
      height: "90vh",
      width: "103.2%",
      display: 'flex',
      alignItems: 'center',
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
        opacity: 0.52,
        zIndex: 1,
      }} />

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '30%',
        marginRight: '12%',
        zIndex: 2,
      }}>
        <Typography
          sx={{
            marginBottom: '50px',
            background: '#E6DBC9',
            borderRadius: '39px',
            color: 'rgba(90, 59, 65, 1)',
            fontFamily: 'Heebo, sans-serif',
            fontWeight: 'bold',
            padding: '0.5% 15%',
            fontSize: '1.2rem',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          אז מי אנחנו?
        </Typography>
        <Box sx={{
          width: '100%',
          height: '250px',
          backgroundImage: `url(${image})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '15px',
        }} />
        <Link to="/products">
          <Button
            variant="contained"
            sx={{
              marginTop: '50px',
              backgroundColor: '#47515A',
              color: 'white',
              padding: '0 50px',
              borderRadius: '50px',
              '&:hover': {
                backgroundColor: '#373F47'
              },
              fontFamily: 'Heebo, sans-serif',
              fontWeight: 'bold',
              fontSize: '1.2rem',
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
        paddingRight: '30%',
        marginRight: '7%',
        marginLeft: '13%',
        fontSize: '1.2rem'
      }}>
        מיזם ייחודי וייעודי לפרסום מגילות אסתר ושאר כתבי סת"ם,<br />
        הלוח נועד לפרסם בתפוצה רחבה מאד מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה הן למעונינים לרכוש והן לסופרי הסת"ם המעוניינים למכור,<br />
        בלוח המגילות תמצאו בקלות ובנוחות מגילת אסתר כלבבכם, מתוך מגוון ענק של כל סוגי מגילות אסתר ולפי כל המנהגים, בטווח מחירים גדול, ובאיכות ובהידור שאתם מחפשים,<br />
        בלוח המגילות מפרסמים טובי הסופרים את היצירות שלהם,<br />
        הלוח מפנה אותך באופן ישיר אל הסופר, בכך תוכל להתרשם מהסופר באופן אישי ולשמוע את כל הפרטים על המגילה שלו, על רמת ההידור וההקפדה החל מבחירת הקלף הדיו והכתיבה עצמה, וכלה בהגהה ותיקון.<br />
        <span style={{ fontWeight: 'bold', color: 'rgba(90, 59, 65, 1)' }}>
          בלוח המגילות תרכשו את המגילה ישר מהסופר, ללא פערי תיווך כלל, ובהתרשמות אישית ובשיח פתוח מול הסופר עצמו.
        </span>
      </Container>
    </Box>
  );
}
