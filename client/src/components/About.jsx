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
    <Box sx={{ direction: 'rtl', padding: '20px 0' }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          <ScrollIcon sx={{ fontSize: 40, color: '#1976d2' }} />
        </Box>
        <Typography variant="h4" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 700,
            color: '#1976d2',
            marginBottom: 1,
            fontSize: { xs: '0.8rem', sm: '1.3rem', md: '1.8rem' }
          }}>
          לוח המגילות
        </Typography>

        <Typography variant="h6" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 500,
            color: '#000',
            marginBottom: 1,
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' }
          }}>
          מיזם ייחודי וייעודי לפרסום מגילות אסתר ושאר כתבי סת"ם
        </Typography>

        {/* Combine similar paragraphs and reduce margins */}
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.3,
            marginBottom: 1,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          הלוח נועד לפרסם בתפוצה רחבה מאוד מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה הן למעוניינים לרכוש והן לסופרי הסת"ם המעוניינים למכור.
          בלוח המגילות תמצאו בקלות ובנוחות מגילת אסתר כלבבכם, מתוך מגוון ענק של כל סוגי מגילות אסתר ולפי כל המנהגים, בטווח מחירים גדול, ובאיכות ובהידור שאתם מחפשים.
        </Typography>

        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.3,
            marginBottom: 1,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          בלוח המגילות מפרסמים טובי הסופרים את היצירות שלהם.
          הלוח מפנה אותך באופן ישיר אל הסופר, בכך תוכל להתרשם מהסופר באופן אישי ולשמוע את כל הפרטים על המגילה שלו, על רמת ההידור וההקפדה החל מבחירת הקלף, הדיו והכתיבה עצמה, וכלה בהגהה ותיקון.
        </Typography>

        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 1.3,
            marginBottom: 1,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          ניתן לפנות אלינו בטלפון: 052-7672693 או במייל: ScrollsSite@gmail.com
        </Typography>
      </Container>
    </Box>
  );
}
