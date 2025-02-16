import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';

const PRICE_LIMITS = [
  { max: 1000, min: 0, price: 0 },
  { max: 1500, min: 1000, price: 10 },
  { max: 2000, min: 1500, price: 20 }
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

  useEffect(() => {
    if (product.price) {
      setPriceLimits(getPriceLimits(product.price));
    }
  }, [product.price]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && (value > priceLimits.max || value < priceLimits.min)) {
      alert(`המחיר חייב להיות בין ${priceLimits.min} ל-${priceLimits.max} ש"ח.`);
      return;
    }
    setEditedProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/productsApi/updateProductsDetails/${editedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedProduct)
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update product');
      }
  
      console.log('Product updated successfully:', responseData);
      window.location.reload();
      onClose();
  
    } catch (error) {
      console.error('Error updating product:', error);
      alert(`שגיאה בעדכון המוצר`);
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
            value={editedProduct.price}
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
    </Dialog>
  );
};

export default EditProductModal;
