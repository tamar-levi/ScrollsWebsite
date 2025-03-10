import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const products = [
  {
    name: 'מודעות עד 6000 ש"ח',
    price: '₪30',
  },
  {
    name: 'מודעות עד 12000 ש"ח',
    desc: 'החל מ-6000 ש"ח',
    price: '₪35',
  },
  {
    name: 'מודעות מעל 12000 ש"ח',
    price: '₪40',
  },
  {
    name: 'מודעה ללא מחיר',
    desc: 'שדה המחיר הוא שדה רשות',
    price: '₪40',
  },
  {
    name: 'מודעת פרימיום',
    desc: 'מודעה מודגשת בתחילת העמוד בתוספת תשלום',
    price: '₪20',
  },
  // {
  //   name: ' שימו לב',
  //   desc: 'בהוספת מגילה סוג המגילה, סוג הכתב ותמונה ראשית הינם שדות חובה.',
  // },
  // {
  //   name: 'הערה חשובה',
  //   desc: 'לצורך בטיחות התשלום שלכם, נדרים פלוס לא מאפשרים שתי עסקאות אשראי במחיר זהה באותו יום העסקים',
  // }
];

export default function Info() {
  return (
    <>
      <Card
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          marginTop: '64px',
          height: '88vh',
          width: '320px',
          backgroundColor: 'rgba(63, 65, 78, 1)',
          borderRadius: '40px 0 0 40px',
          boxShadow: 3,
          p: 2,
          zIndex: 1000,
          fontFamily: 'Heebo, sans-serif',
        }}
      >
        <Typography
          sx={{
            background: 'rgba(230, 219, 201, 1)',
            borderRadius: '39px',
            color: 'rgba(0, 0, 0, 1)',
            fontFamily: 'Heebo, sans-serif',
            fontWeight: 'bold',
            padding: '1px 40%',
            textAlign: 'center',
            width: 'fit-content',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            fontWeight: 300,
            marginTop: '50%',
          }}
        >
          מחירון
        </Typography>
        <CardContent>
          <List disablePadding>
            {products.map((product) => (
              <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
                <ListItemText
                  sx={{ mr: 2 }}
                  primary={<Typography sx={{ color: 'rgba(230, 219, 201, 1)' }}>{product.name}</Typography>}
                  secondary={product.desc && <Typography sx={{ fontWeight: 200, color: 'rgba(230, 219, 201, 1)' }}>{product.desc}</Typography>}
                />
                <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'rgba(122, 89, 80, 1)' }}>
                  {product.price}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  );
}
