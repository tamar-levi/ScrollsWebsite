import * as React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

export default function About() {
  const text1 = `בלוח המגילות תמצאו מגוון רחב של מגילות אסתר לפי כל המנהגים, 
  ובטווח מחירים רחב. אנו מחברים אתכם ישירות לסופרי הסת"ם, כך שתוכלו להתרשם 
  באופן אישי וללא פערי תיווך.`;
  const text2 = `אנו מספקים פלטפורמה אמינה המאפשרת קנייה בטוחה היישר מהסופר, 
  תוך שמירה על סטנדרטים מחמירים של איכות והידור.`;

  return (
    <Box sx={{ padding: '40px', backgroundColor: '#f9f9f9', direction: 'rtl' }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontFamily: 'Rubik, sans-serif',
          fontWeight: 700,
          marginBottom: 4,
          color: '#3f3f3f',
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
          marginBottom: 4,
          color: '#555',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: 1.8,
        }}
      >
        מיזם ייחודי וייעודי לפרסום מגילות אסתר ושאר כתבי סת"ם.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {["קנייה ישירה מהסופר", "אמינות ושקיפות"].map((title, index) => (
          <Grid item xs={12} md={5} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                backgroundColor: '#ffffff',
                border: '2px solid rgba(0, 123, 255, 0.5)', // תכלת בהיר ושקוף
                boxShadow: '0px 8px 20px rgba(0, 123, 255, 0.3)', // הצללה עדינה
                borderRadius: '8px',
                textAlign: 'right',
                minHeight: '180px',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 600, color: '#3f3f3f', marginBottom: 2 }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: 'Rubik, sans-serif', color: '#555', lineHeight: 1.6 }}
              >
                {index === 0 ? text1 : text2}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#555',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.8,
          }}
        >
          הלוח מפנה אותך ישירות לסופר, כך שתוכל לשמוע את כל הפרטים על המגילה – רמת ההידור, בחירת הקלף והדיו, ותהליך ההגהה והתיקון.
        </Typography>
      </Box>

      <Box sx={{ marginTop: 5, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: 'Rubik, sans-serif', fontWeight: 600, color: '#3f3f3f', marginBottom: 1 }}
        >
          זקוקים לעזרה?
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontFamily: 'Rubik, sans-serif', color: '#555' }}
        >
          ניתן לפנות אלינו בטלפון: 052-7672693 או במייל: ScrollsSite@gmail.com
        </Typography>
      </Box>
    </Box>
  );
}
