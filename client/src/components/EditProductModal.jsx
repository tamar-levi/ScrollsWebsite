import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import imageCompression from 'browser-image-compression';

const EditProductModal = ({ open, onClose, product }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product, additionalImages: product.additionalImages || [] });
  const [imagePreview, setImagePreview] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: false,
  };

  const compressImage = async (imageFile) => {
    return await imageCompression(imageFile, compressionOptions);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  const openPreview = (image) => {
    setImagePreview(image);
    setPreviewOpen(true);
  };

  const removeImage = (index) => {
    setEditedProduct(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = async (e, type, index = null) => {
    if (e.target.files[0]) {
      const files = e.target.files;
      const compressedImages = await Promise.all(
        Array.from(files).map(file => compressImage(file))
      );
      const base64Images = await Promise.all(
        compressedImages.map(file => toBase64(file))
      );

      setEditedProduct(prev => {
        const updatedImages = [...prev.additionalImages];
        if (type === 'primary') {
          return { ...prev, primaryImage: base64Images[0] };
        } else {
          base64Images.forEach((base64, i) => {
            if (index !== null) {
              updatedImages[index] = base64;
            } else {
              updatedImages.push(base64);
            }
          });
          return { ...prev, additionalImages: updatedImages };
        }
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setAlertMessage("מעבד את השינויים, אנא המתן...");
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('לא נמצא טוקן, התחבר מחדש');
        return;
      }
      const response = await fetch(`https://scrolls-website.onrender.com/productsApi/updateProductsDetails/${editedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedProduct)
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Failed to update product');

      console.log('Product updated successfully:', responseData);
      window.location.reload();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('שגיאה בעדכון המוצר');
    } finally {
      setIsLoading(false);
      setAlertMessage(null);
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result.split(',')[1];
      resolve(result);
    };
    reader.onerror = error => reject(error);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ borderRadius: '24px', backgroundColor: '#fff', direction: 'rtl' }}>
      <Typography sx={{
        background: 'rgba(230, 219, 201, 1)',
        borderRadius: '39px',
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: 'Heebo, sans-serif',
        padding: { xs: '1px 15%', sm: '1px 20%' },
        textAlign: 'center',
        width: 'fit-content',
        fontWeight: 'bold',
        margin: '20px auto 0',
        fontSize: { xs: '0.9rem', sm: '1rem' },
        display: 'block'
      }}>
        עריכת פרטי מגילה
      </Typography>
      <DialogContent>
        {alertMessage && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

        {isLoading && (
          <Box sx={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <CircularProgress size={50} />
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField name="scrollType" label="סוג המגילה" value={editedProduct.scrollType} onChange={handleChange} fullWidth />
          <TextField name="scriptType" label="סוג הכתב" value={editedProduct.scriptType} onChange={handleChange} fullWidth />
          <TextField name="note" label="הערות" value={editedProduct.note} onChange={handleChange} fullWidth multiline rows={3} />
          <TextField name="price" label="מחיר" value={editedProduct.price} onChange={handleChange} fullWidth type="number" />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => openPreview(editedProduct.primaryImage)}
              sx={{
                width: { xs: '100%', sm: '150px' },
                gap: '6px',
                backgroundColor: 'rgba(90, 59, 65, 1)',
                borderRadius: '24px',
                fontFamily: 'Heebo, sans-serif',
                height: { xs: '35px', sm: '30px' },
                minHeight: { xs: '35px', sm: '30px' },
                color: '#fff',
                fontWeight: 200
              }}
            >
              הצג תמונה ראשית
            </Button>
            <IconButton color="primary" component="label">
              <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 'primary')} />
              <EditIcon />
            </IconButton>
          </Box>

          {editedProduct.additionalImages.map((img, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" onClick={() => openPreview(img)} 
              sx={{
                width: { xs: '100%', sm: '150px' },
                gap: '6px',
                backgroundColor: 'rgba(90, 59, 65, 1)',
                borderRadius: '24px',
                fontFamily: 'Heebo, sans-serif',
                height: { xs: '35px', sm: '30px' },
                minHeight: { xs: '35px', sm: '30px' },
                color: '#fff',
                fontWeight: 200
              }}
            >
                הצג תמונה
              </Button>
              <IconButton color="primary" component="label">
                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, 'additional', index)} />
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => removeImage(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <label htmlFor="additional-images-upload">
            <input id="additional-images-upload" type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, 'additional')} style={{ display: 'none' }} />
            <Button
              variant="contained"
              component="span"
              sx={{
                width: { xs: '100%', sm: '200px' },
                gap: '6px',
                backgroundColor: 'rgba(90, 59, 65, 1)',
                borderRadius: '24px',
                fontFamily: 'Heebo, sans-serif',
                height: { xs: '35px', sm: '30px' },
                minHeight: { xs: '35px', sm: '30px' },
                color: '#fff',
                fontWeight: 200,
                marginTop: { xs: 2, sm: 3 }
              }}
            >
              הוסף תמונות נוספות
            </Button>
          </label>
        </Box>
      </DialogContent>

      <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2, padding: '20px' }}>
  <Button 
    onClick={onClose}
    variant="contained"
    sx={{
      backgroundColor: 'rgba(63, 65, 78, 1)',
      borderRadius: '25px',
      color: 'white',
      padding: { xs: '1px 8%', md: '1px 10%' },
      fontFamily: 'Heebo, sans-serif',
      fontSize: { xs: '0.95rem', md: '1rem' },
      fontWeight: 300,
      '&:hover': {
        backgroundColor: 'rgba(63, 65, 78, 1)',
      },
    }}
  >
    ביטול
  </Button>
  <Button
    onClick={handleSubmit}
    variant="contained"
    disabled={isLoading}
    sx={{
      backgroundColor: 'rgba(63, 65, 78, 1)',
      borderRadius: '25px',
      color: 'white',
      padding: { xs: '1px 8%', md: '1px 10%' },
      fontFamily: 'Heebo, sans-serif',
      fontSize: { xs: '0.95rem', md: '1rem' },
      fontWeight: 300,
      '&:hover': {
        backgroundColor: 'rgba(63, 65, 78, 1)',
      },
    }}
  >
    {isLoading ? 'שמור שינויים (בעיבוד)' : 'שמור שינויים'}
  </Button>
</DialogActions>


      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <DialogContent>
          {imagePreview ? (
            <Box
              component="img"
              src={`data:image/jpeg;base64,${imagePreview}`}
              alt="תצוגה מקדימה"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          ) : (
            <p>אין תמונה להצגה</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>סגור</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default EditProductModal;
