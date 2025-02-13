import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const products = [
  {
    name: 'מודעות עד 6000 ש"ח',
    desc: 'החל מ-1000 ש"ח',
    price: '₪30',
  },
  {
    name: 'מודעות עד 12000 ש"ח',
    desc: 'החל מ-6000 ש"ח',
    price: '₪35',
  },
  {
    name: 'מודעות מעל 12000 ש"ח',
    desc: 'החל מ-12000 ש"ח',
    price: '₪40',
  },
  {
    name: 'מודעת פרימיום',
    desc: 'מודעה מודגשת בתוספת תשלום',
    price: '₪20',
  },
];


export default function Info() {
  return (
    <>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', paddingRight: "5%" }}>
        מחירון
      </Typography>
      <List disablePadding>
        {products.map((product) => (
          <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={product.name}
              secondary={product.desc}
            />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {product.price}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
}
