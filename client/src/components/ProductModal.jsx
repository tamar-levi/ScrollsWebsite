import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import ImageSlider from './ImageSlider';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import DrawIcon from '@mui/icons-material/Draw';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SellerDetailsModal from './SellerDetailsModal';

const ProductModal = ({ product, onClose }) => {
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleSellerDetailsClick = () => {
    setIsSellerModalOpen(true);
  };

  const handleSellerModalClose = () => {
    setIsSellerModalOpen(false);
  };

  useEffect(() => {
    if (!product?._id) return;

    const fetchImages = async () => {
      try {
        setLoading(true);

        const [primaryImageResponse, additionalImagesResponse] = await Promise.all([
          fetch(`https://scrolls-website.onrender.com/productsApi/getProductPrimaryImage/${product._id}`),
          fetch(`https://scrolls-website.onrender.com/productsApi/getProductAdditionalImages/${product._id}`)
        ]);

        if (!primaryImageResponse.ok || !additionalImagesResponse.ok) {
          throw new Error('Failed to fetch images');
        }

        const primaryImageData = await primaryImageResponse.json();
        const additionalImagesData = await additionalImagesResponse.json();

        const allImages = [
          primaryImageData.primaryImage,
          ...additionalImagesData.additionalImages,
        ];
        setImages(allImages);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [product._id]);

  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth dir="rtl">
        <DialogTitle sx={{ textAlign: 'right', fontFamily: 'Heebo, sans-serif' }}>
          {product.title}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ textAlign: 'right' }}>
            {loading ? (
              <Typography variant="body2" color="textSecondary" fontFamily='Heebo, sans-serif'>טוען תמונות...</Typography>
            ) : (
              <ImageSlider images={images} />
            )}
            <Typography variant="body2" fontWeight="bold" sx={{ textAlign: 'center', marginBottom: '5px', marginTop: '10px',fontFamily: 'Heebo, sans-serif' }}>
              ניתן ללחוץ על התמונה ע"מ להציג אותה בגודל מלא
            </Typography>
            <Typography variant="body1" paragraph fontFamily='Heebo, sans-serif'>
              {product.note}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Heebo, sans-serif' }}>
              <PriceCheckIcon /> מחיר: {product.price} ₪
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Heebo, sans-serif' }}>
              <DrawIcon /> סוג הכתב: {product.scriptType}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Heebo, sans-serif' }}>
              <AutoStoriesIcon /> סוג המגילה: {product.scrollType}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 2 }}>
        <Button
            color="primary"
            onClick={handleSellerDetailsClick}
            endIcon={<PersonIcon />}
            sx={{
              gap: '6px',
              backgroundColor: 'rgba(230, 219, 201, 1)',
              borderRadius: '20px',
              fontFamily: 'Heebo, sans-serif',
              height: '32px',
              minHeight: '30px',
              minWidth: '120px', 
              color: 'rgba(90, 59, 65, 1)',
            }}
          >
            פרטי המוכר
          </Button>
          <Button
            onClick={onClose}
            color="primary"
            endIcon={<CloseIcon />}
            sx={{
              gap: '6px',
              color: 'rgba(90, 59, 65, 1)',
              backgroundColor: 'rgba(230, 219, 201, 1)',
              borderRadius: '20px',
              fontFamily: 'Heebo, sans-serif',
              height: '32px',
              minHeight: '30px',
              minWidth: '100px', 
            }}
          >
            סגור
          </Button>

        </DialogActions>
      </Dialog>
      <SellerDetailsModal sellerId={product.userId._id} isOpen={isSellerModalOpen} onClose={handleSellerModalClose} />
    </>
  );
};

export default ProductModal;
