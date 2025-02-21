import React, { useState } from 'react';
import Slider from 'react-slick';
import { Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  if (!images?.length) {
    return <Typography variant="body2" color="textSecondary">אין תמונות נוספות</Typography>;
  }

  return (
    <>
      <Slider {...sliderSettings}>
        {images.map((image, index) => (
          <div key={index} onClick={() => handleOpen(image)}>
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt={`Image ${index + 1}`}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'contain',
                borderRadius: '4px',
                marginBottom: '10px',
                display: 'block',
                margin: '0 auto',
                cursor: 'pointer'
              }}
            />
          </div>
        ))}
      </Slider>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>

        <DialogContent>
          <img
            src={`data:image/jpeg;base64,${selectedImage}`}
            alt="Enlarged"
            style={{
              width: '80%',
              height: 'auto',
              objectFit: 'contain',
              margin: '0 auto',
              display: 'block',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            style={{ marginLeft: 'auto', fontWeight: 'bold' }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageSlider;
