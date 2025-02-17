import * as React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function About() {
  return (
    <Box 
      sx={{
        backgroundColor: '#f0f0f0',
        minHeight: '100vh', 
        backgroundColor: '#f0f0f0', 
        display: 'flex', 
        width: '100vw', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px 0',
        direction: 'rtl'
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 700,
            color: '#3f3f3f',
            marginBottom: 6,
            lineHeight: 1.2,
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          לוח המגילות
        </Typography>

        <Typography
          variant="h5"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 500,
            color: '#4a4a4a',
            marginBottom: 6,
            lineHeight: 1.8,
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          מיזם ייחודי וייעודי לפרסום מגילות אסתר ושאר כתבי סת"ם
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#555',
            lineHeight: 1.8,
            marginBottom: 6,
            textAlign: 'right',
            fontSize: '1.1rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          הלוח נועד לפרסם בתפוצה רחבה מאד מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה הן למעוניינים לרכוש והן לסופרי הסת"ם המעוניינים למכור.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#555',
            lineHeight: 1.8,
            marginBottom: 6,
            textAlign: 'right',
            fontSize: '1.1rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          בלוח המגילות תמצאו בקלות ובנוחות מגילת אסתר כלבבכם, מתוך מגוון ענק של כל סוגי מגילות אסתר ולפי כל המנהגים, בטווח מחירים גדול, ובאיכות ובהידור שאתם מחפשים.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#555',
            lineHeight: 1.8,
            marginBottom: 6,
            textAlign: 'right',
            fontSize: '1.1rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          בלוח המגילות מפרסמים טובי הסופרים את היצירות שלהם.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#555',
            lineHeight: 1.8,
            marginBottom: 6,
            textAlign: 'right',
            fontSize: '1.1rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          הלוח מפנה אותך באופן ישיר אל הסופר, בכך תוכל להתרשם מהסופר באופן אישי ולשמוע את כל הפרטים על המגילה שלו, על רמת ההידור וההקפדה החל מבחירת הקלף, הדיו והכתיבה עצמה, וכלה בהגהה ותיקון.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#555',
            lineHeight: 1.8,
            marginBottom: 6,
            textAlign: 'right',
            fontSize: '1.1rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          אצלנו לא תפלו בפח של סוחר שמנסה למכור לכם מגילות של סופרי סת"ם אנונימיים שלא תמיד תדעו את זהותם. בלוח המגילות תרכשו את המגילה ישר מהסופר, ללא פערי תיווך כלל, ובהתרשמות אישית ובשיח פתוח מול הסופר עצמו.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#555',
            lineHeight: 1.8,
            marginBottom: 6,
            textAlign: 'right',
            fontSize: '1.1rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          אנחנו עושים הכל על מנת שהשימוש בלוח יהיה קל, זמין ונוח. אם בכל זאת נתקלתם בבעיה או סתם שאלה, תוכלו לפנות אלינו בטלפון: 052-7672693 או במייל: ScrollsSite@gmail.com
        </Typography>

        <Box sx={{ backgroundColor: '#ffffff', padding: '40px 20px', borderRadius: '8px', marginTop: '50px' }}>
          <Typography
            variant="h6"
            align="center"
            sx={{
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 600,
              color: '#3f3f3f',
              marginBottom: 4,
            }}
          >
            זקוקים לעזרה?
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              fontFamily: 'Rubik, sans-serif',
              color: '#555',
              fontSize: '1.1rem',
              
            }}
          >
            ניתן לפנות אלינו בטלפון: 052-7672693 או במייל: ScrollsSite@gmail.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
