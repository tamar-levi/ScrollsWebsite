import React from 'react';
import { Card, CardContent, Button, Typography, Box } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';

const ProductCard = ({ product, onOpenModal }) => {
  const typographyStyle = {
    fontSize: { xs: '0.8rem', sm: '0.9rem' },
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'right',
    transition: 'all 0.3s ease'
  };

  const iconStyle = {
    fontSize: { xs: '0.9rem', sm: '1rem' },
    strokeWidth: 1,
    color: '#1976d2'
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
        border: product.isPremiumAd ? '2px solid #1976d2' : 'none'
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.1,
          backgroundColor: '#ffffff'
        }}
      >
        <Typography sx={typographyStyle}>
          <PersonOutlineIcon sx={iconStyle} />
          <strong>שם הסופר:</strong> {product.userId.displayName || product.userId.fullName}
        </Typography>
        <Typography sx={typographyStyle}>
          <ArticleOutlinedIcon sx={iconStyle} />
          <strong>סוג המגילה:</strong> {product.scrollType}
        </Typography>
        <Typography sx={typographyStyle}>
          <DriveFileRenameOutlineIcon sx={iconStyle} />
          <strong>סוג הכתב:</strong> {product.scriptType}
        </Typography>
        <Typography sx={typographyStyle}>
          <SellOutlinedIcon sx={iconStyle} />
          <strong>מחיר:</strong>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {product.price ? `${product.price} ₪` : 'לא צוין'}
          </Box>
        </Typography>
        <Typography sx={typographyStyle}>
          <LocationCityOutlinedIcon sx={iconStyle} />
          <strong>עיר:</strong> {product.userId.city || 'לא צוין'}
        </Typography>
        <Button
          onClick={() => onOpenModal(product)}
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
        >
          תמונות ופרטים נוספים
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
