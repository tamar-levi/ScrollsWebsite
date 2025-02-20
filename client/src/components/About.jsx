import * as React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ScrollIcon from '@mui/icons-material/HistoryEdu';
import { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };
  
    handleResize(); 
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto"; 
    };
  }, []);
  
  return (
    <Box sx={{ direction: 'rtl', padding: '60px 0' }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <ScrollIcon sx={{ fontSize: 40, color: '#1976d2' }} />
        </Box>
        <Typography variant="h4" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 700,
            color: '#1976d2',
            marginBottom: 2,
            fontSize: { xs: '0.8rem', sm: '1.3rem', md: '1.8rem' }
          }}>
          לוח המגילות
        </Typography>
        <Typography variant="h4" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 700,
            color: '#1976d2',
            marginBottom: 2,
            fontSize: { xs: '0.8rem', sm: '1.3rem', md: '1.8rem' }
          }}>
          לוח המגילות
        </Typography>
        <Typography variant="h6" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 500,
            color: '#000',
            marginBottom: 3,
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' }
          }}>
          מיזם ייחודי וייעודי פורץ דרך לפרסום מגילות אסתר ושאר כתבי סת"ם.
        </Typography>
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 2,
            marginBottom: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          הלוח נועד לפרסם בתפוצה רחבה מגילות אסתר ושאר חפצי סת"ם, ובכך נותן מענה הן למעוניינים לרכוש והן לסופרי הסת"ם המעוניינים למכור.
        </Typography>
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 2,
            marginBottom: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          חולמים על מגילה משלכם? בלוח המגילות תמצאו בקלות ובנוחות מגילת אסתר כלבבכם, לפי כל המנהגים, ברמות שונות ובמחיר הטוב ביותר, באיכות ובהידור שאתם מחפשים.
        </Typography>
        <Typography variant="h6" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 500,
            color: '#000',
            marginBottom: 3,
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' }
          }}>
          איך זה עובד?
        </Typography>
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 2,
            marginBottom: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          הלוח מעניק לך פלטפורמה ייחודית לרכישת מגילה בעצמך  - בשקיפות ובאחריות מלאה של הסופר, וללא עמלות סוחר.
        </Typography>
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 2,
            marginBottom: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          אצלינו הרכישה מתבצעת ישירות מול הסופר על ידי יצירת קשר אישי עם הסופר,
          וכך תוכל לקבל את כל המידע שרצית על הסופר ועל המגילה שכתב.
        </Typography>
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 2,
            marginBottom: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          לראות בעיניך שהסופר אכן מחזיק בתעודה בתוקף,
          לברר על איזה קלף ובאיזה דיו היא נכתבה,
          תוכל גם לוודא שהמגילה עברה הגהה רצינית ומדוקדקת
          ולקבל מחיר הוגן ללא פערי תיווך.
        </Typography>
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 2,
            marginBottom: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          ומבלי להיות נתון לחסדיהם של סוחרים שיתכן ומוכרים לך חתול בשק, מבלי שתדע באופן ברור מה עבר על המגילה, ומה טיבו של הסופר שכתב אותה.
        </Typography>
        <Typography variant="h6" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 500,
            color: '#000',
            marginBottom: 3,
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' }
          }}>
          כאן רוכשים ישירות מהסופר!
        </Typography>
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 2,
            marginBottom: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          אנחנו עושים הכל על מנת שהשימוש בלוח יהיה קל, זמין ונוח. אם בכל זאת נתקלתם בבעיה או סתם שאלה
        </Typography>
        <Typography variant="body1" align="center"
          sx={{
            fontFamily: 'Rubik, sans-serif',
            color: '#000',
            lineHeight: 2,
            marginBottom: 3,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
          }}>
          ניתן לפנות אלינו בטלפון: 052-7672693 או במייל: ScrollsSite@gmail.com
        </Typography>
      </Container>
    </Box>
  );
}
