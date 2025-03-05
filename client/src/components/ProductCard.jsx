import React from 'react';
import { Card, CardContent, Button, Typography, Box, CardMedia } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import cardImage from '../assets/Card.png';

const ProductCard = ({ product, onOpenModal }) => {
  const typographyStyle = {
    fontSize: { xs: '0.8rem', sm: '0.9rem' },
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'right',
    transition: 'all 0.3s ease',
    color: product.isPremiumAd ? '#E6DBC9' : 'white',
    fontFamily: 'Heebo, sans-serif',
    fontWeight: 200,
  };

  const iconStyle = {
    fontSize: { xs: '0.9rem', sm: '1rem' },
    strokeWidth: 1,
    color: product.isPremiumAd ? '#E6DBC9' : 'white',
  };

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '300px' },
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        mx: 'auto',
        direction: 'rtl',
        backgroundColor: product.isPremiumAd ? '#5A3B41' : '#3F414E',
        color: 'white',
        height: '500px',
      }}
    >
      <Box
        component="img"
        src={cardImage}
        alt={product.scriptType}
        sx={{
          width: '100%',
          height: { xs: '180px', sm: '220px' },
          objectFit: 'cover',
        }}
      />
      <CardContent
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.15,
          backgroundColor: 'inherit',
          position: 'relative',
        }}
      >
        <Typography sx={typographyStyle}>
          <PersonOutlineIcon sx={iconStyle} />
          <span style={{ fontWeight: 600 }}>שם הסופר:</span> {product.userId.displayName || product.userId.fullName}
        </Typography>
        <Typography sx={typographyStyle}>
          <ArticleOutlinedIcon sx={iconStyle} />
          <span style={{ fontWeight: 600 }}>סוג המגילה:</span> {product.scrollType}
        </Typography>
        <Typography sx={typographyStyle}>
          <DriveFileRenameOutlineIcon sx={iconStyle} />
          <span style={{ fontWeight: 600 }}>סוג הכתב:</span> {product.scriptType}
        </Typography>
        <Typography sx={typographyStyle}>
          <SellOutlinedIcon sx={iconStyle} />
          <span style={{ fontWeight: 600 }}>מחיר:</span> {product.price ? `${product.price} ₪` : 'לא צוין'}
        </Typography>
        <Typography sx={typographyStyle}>
          <LocationCityOutlinedIcon sx={iconStyle} />
          <span style={{ fontWeight: 600 }}>עיר:</span> {product.userId.city || 'לא צוין'}
        </Typography>
        <Button
          onClick={() => onOpenModal(product)}
          variant="outlined"
          color="primary"
          sx={{
            position: 'absolute',
            width: '190px',
            height: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '-5px',
            background: '#E6DBC9',
            borderRadius: '50px',
            color: product.isPremiumAd ? '#5A3B41' : '#3F414E',
            borderColor: 'white',
          }}
        >
          תמונות ופרטים נוספים
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
