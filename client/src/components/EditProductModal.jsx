import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert
} from '@mui/material';

const PRICE_LIMITS = [
  { max: 6000, min: 0, price: 30 },
  { max: 12000, min: 6000, price: 35 },
  { max: Infinity, min: 12000, price: 40 }
];

const getPriceLimits = (initialPrice) => {
  for (let i = 0; i < PRICE_LIMITS.length; i++) {
    if (initialPrice <= PRICE_LIMITS[i].max) {
      return { max: PRICE_LIMITS[i].max, min: PRICE_LIMITS[i].min };
    }
  }
  return { max: Infinity, min: 0 };
};

const EditProductModal = ({ open, onClose, product }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [priceLimits, setPriceLimits] = useState({ max: Infinity, min: 0 });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (product.price !== undefined && product.price !== "") {
      setPriceLimits(getPriceLimits(product.price));
    } else {
      setPriceLimits({ max: Infinity, min: 0 });
    }
  }, [product.price]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && value === "") {
      setEditedProduct(prev => ({
        ...prev,
        [name]: priceLimits.max
      }));
      return;
    }

    if (name === "price" && value > priceLimits.max) {
      setAlertMessage(`המחיר חורג מתקרת הסכום של פרסום המודעה: ${priceLimits.max} ש\"ח.`);
      setAlertOpen(true);
      return;
    }

    setEditedProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://scrolls-website.onrender.com/productsApi/updateProductsDetails/${editedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct),
        credentials: 'include'
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update product');
      }
      window.location.reload();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      setAlertMessage("שגיאה בעדכון המוצר");
      setAlertOpen(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>עריכת מוצר</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="scrollType"
            label="סוג המגילה"
            value={editedProduct.scrollType}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="scriptType"
            label="סוג הכתב"
            value={editedProduct.scriptType}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="note"
            label="הערות"
            value={editedProduct.note}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            name="price"
            label="מחיר"
            value={editedProduct.price || ''}
            onChange={handleChange}
            fullWidth
            type="number"
            inputProps={{ min: priceLimits.min, max: priceLimits.max }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          שמור שינויים
        </Button>
      </DialogActions>
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
        <Alert severity="error" onClose={() => setAlertOpen(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditProductModal;
