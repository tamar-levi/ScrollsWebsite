import React from 'react';
import { Card, CardContent, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



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
      const response = await fetch(`http://localhost:5000/productsApi/deleteProduct/${product._id}`, {
        method: 'DELETE',
        credentials: 'include'
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
    fontSize: '0.9rem',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const iconStyle = {
    fontSize: '1rem',
    strokeWidth: 1
  };

  return (
    <>
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
          border: product.isPremiumAd ? '2px solid transparent' : 'none',
          boxShadow: product.isPremiumAd ? '0 0 15px 3px rgba(30, 144, 255, 0.8)' : '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box
          component="img"
          src={`data:image/jpeg;base64,${product.primaryImage}`}
          alt={product.scriptType}
          sx={{
            width: '100%',
            height: { xs: '180px', sm: '220px' },
            objectFit: 'cover',
          }}
        />
        <CardContent sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          backgroundColor: '#ffffff'
        }}>
          <Typography style={typographyStyle}>
            <ArticleOutlinedIcon sx={iconStyle} />
            <strong>סוג המגילה:</strong> {product.scrollType}
          </Typography>
          <Typography style={typographyStyle}>
            <DriveFileRenameOutlineIcon sx={iconStyle} />
            <strong>סוג הכתב:</strong> {product.scriptType}
          </Typography>
          <Typography style={typographyStyle}>
            <StickyNote2OutlinedIcon sx={iconStyle} />
            <strong>הערות:</strong> {product.note || 'אין הערות'}
          </Typography>
          <Typography style={typographyStyle}>
            <SellOutlinedIcon sx={iconStyle} />
            <strong>מחיר:</strong> {product.price} ₪
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              className="edit-button"
              onClick={() => onOpenEditModal(product)}
              variant="outlined"
              color="primary"
              endIcon={<EditIcon />}
              sx={{ '& .MuiButton-endIcon': { marginRight: '8px', marginLeft: 0 } }}
            >
              עריכת מוצר
            </Button>
            <Button
              className="delete-button"
              onClick={handleDeleteClick}
              variant="outlined"
              color="error"
              endIcon={<DeleteIcon />}
              sx={{ '& .MuiButton-endIcon': { marginRight: '8px', marginLeft: 0 } }}
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
