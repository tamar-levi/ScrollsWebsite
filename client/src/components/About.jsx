import * as React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ScrollIcon from '@mui/icons-material/HistoryEdu';
import { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Box sx={{ direction: 'rtl', padding: '40px 0' }}>
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={2}
          sx={{
            mt: { xs: 2, sm: 5 } 
          }}
        >
          <ScrollIcon sx={{ fontSize: 50, color: '#1976d2' }} />
        </Box>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 700,
            color: '#1976d2',
            marginBottom: 2,
            lineHeight: 1.2,
            fontSize: { xs: '0.8rem', sm: '1.5rem', md: '2rem' }
          }}
        >
          לוח המגילות
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 500,
            color: '#000',
            marginBottom: 2,
            lineHeight: 1.2,
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
          }}
        >
          מיזם ייחודי וייעודי לפרסום מגילות אסתר ושאר כתבי סת"ם
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.5,
            marginBottom: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }  // שינוי גודל הכתב באופן דינמי
          }}
        >
          הלוח נועד לפרסם בתפוצה רחבה מאוד מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה הן למעוניינים לרכוש והן לסופרי הסת"ם המעוניינים למכור.
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.5,
            marginBottom: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
          }}
        >
          בלוח המגילות תמצאו בקלות ובנוחות מגילת אסתר כלבבכם, מתוך מגוון ענק של כל סוגי מגילות אסתר ולפי כל המנהגים, בטווח מחירים גדול, ובאיכות ובהידור שאתם מחפשים.
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.5,
            marginBottom: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
          }}
        >
          בלוח המגילות מפרסמים טובי הסופרים את היצירות שלהם.
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.5,
            marginBottom: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
          }}
        >
          הלוח מפנה אותך באופן ישיר אל הסופר, בכך תוכל להתרשם מהסופר באופן אישי ולשמוע את כל הפרטים על המגילה שלו, על רמת ההידור וההקפדה החל מבחירת הקלף, הדיו והכתיבה עצמה, וכלה בהגהה ותיקון.
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.5,
            marginBottom: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
          }}
        >
          אצלנו לא תפלו בפח של סוחר שמנסה למכור לכם מגילות של סופרי סת"ם אנונימיים שלא תמיד תדעו את זהותם. בלוח המגילות תרכשו את המגילה ישר מהסופר, ללא פערי תיווך כלל, ובהתרשמות אישית ובשיח פתוח מול הסופר עצמו.
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.5,
            marginBottom: 2,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
          }}
        >
          אנחנו עושים הכל על מנת שהשימוש בלוח יהיה קל, זמין ונוח. אם בכל זאת נתקלתם בבעיה או סתם שאלה
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
          }}
        >
          ניתן לפנות אלינו בטלפון: 052-7672693 או במייל: ScrollsSite@gmail.com
        </Typography>
      </Container>
    </Box>
  );
}
