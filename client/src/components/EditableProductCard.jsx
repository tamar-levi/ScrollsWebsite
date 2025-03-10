import React from 'react';
import { Card, CardContent, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import cardImage from '../assets/Card.png';

const EditableProductCard = ({ product, onOpenEditModal, onDelete }) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('לא נמצא טוקן, התחבר מחדש');
        return;
      }
      const response = await fetch(`https://scrolls-website.onrender.com/productsApi/deleteProduct/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onDelete(product._id);
        setOpenDialog(false);
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`שגיאה במחיקת המוצר`);
    }
  };

  const typographyStyle = {
    fontSize: { xs: '0.9rem', sm: '0.9rem' },
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
    <>
      <Card
        sx={{
          width: { xs: '90%', sm: '300px' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          direction: 'rtl',
          backgroundColor: product.isPremiumAd ? '#5A3B41' : '#3F414E',
          color: 'white',
          height: { xs: '440px', md: '460px' }
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
          <Box display="flex" gap={1} sx={{
            position: 'absolute',
            bottom: { xs: '-45px', sm: '-25px', md: '-25px' },
            left: '50%',
            transform: 'translateX(-50%)',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            width: { xs: '50%', sm: 'auto' },
            padding: { xs: '0 20px', sm: 0 }
          }}>
            <Button
              onClick={() => onOpenEditModal(product)}
              variant="outlined"
              color="primary"
              endIcon={<EditIcon />}
              sx={{
                width: { xs: '100%', sm: '150px' },
                height: '25px',
                background: '#E6DBC9',
                borderRadius: '50px',
                color: product.isPremiumAd ? '#5A3B41' : '#3F414E',
                borderColor: 'white',
                '& .MuiButton-endIcon': { marginRight: '8px', marginLeft: 0 },
                mb: { xs: 1, sm: 0 }
              }}
            >
              עריכת פרטים
            </Button>
            <Button
              className="delete-button"
              onClick={handleDeleteClick}
              endIcon={<DeleteIcon />}
              variant="outlined"
              color="primary"
              sx={{
                width: { xs: '100%', sm: '100px' },
                height: '25px',
                background: '#E6DBC9',
                borderRadius: '50px',
                color: product.isPremiumAd ? '#5A3B41' : '#3F414E',
                borderColor: 'white',
                '& .MuiButton-endIcon': { marginRight: '8px', marginLeft: 0 }
              }}
            >
              מחיקה
            </Button>
          </Box>


        </CardContent>
      </Card>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        dir="rtl"
      >
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          האם אתה בטוח שברצונך למחוק מוצר זה?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            ביטול
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditableProductCard;
