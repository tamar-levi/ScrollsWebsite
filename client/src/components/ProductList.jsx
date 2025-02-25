import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import FilterComponent from './FilterComponent';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [noProducts, setNoProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.currentUser);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://scrolls-website.onrender.com/productsApi/getAllProducts', {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        const data = await response.json();

        const filteredData = data.filter(product => {
          const fullName = product.userId?.fullName?.trim().toLowerCase();
          return !fullName.includes('rachel chadad');
        });
        setProducts(filteredData);
        setFilteredProducts(filteredData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleFilter = ({ priceRange, fontType, scrollType, city, seller }) => {
    const filtered = products.filter((product) => {
      const isPriceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      const normalizedProductFont = product.scriptType?.replace(/['"]/g, '');
      const normalizedFilterFont = fontType?.replace(/['"]/g, '');
      const isFontTypeMatch = fontType ? normalizedProductFont === normalizedFilterFont : true;
      const isScrollTypeMatch = scrollType ? product.scrollType === scrollType : true;
      const isCityMatch = city ? product.userId.city == city : true;
      const isSellerMatch = seller
        ? (product.userId?.displayName?.trim().toLowerCase() == seller.trim().toLowerCase()) ||
        (product.userId?.fullName?.trim().toLowerCase() == seller.trim().toLowerCase())
        : true;
      return isPriceInRange && isFontTypeMatch && isScrollTypeMatch && isCityMatch && isSellerMatch;
    });

    setFilteredProducts(filtered);
    setNoProducts(filtered.length === 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filteredProducts]);

  return (
    <>
      <Box sx={{ marginTop: 8, marginRight: '20%' }}>
        <Stack spacing={2} direction="row">
          <Button
            variant="outlined"
            onClick={() => {
              if (!navigator.cookieEnabled) {
                alert('הדפדפן שלך לא תומך בקוקיז, ע"מ להוסיף מגילה עליך לאפשר קוקיז ולהתחבר מחדש');
              } else if (!user) {
                setOpenAlert(true);
              } else {
                navigate('/add-product');
              }
            }}
            startIcon={<AddIcon />}
          >
            פרסם את המגילה שלך
          </Button>
          <Snackbar
            open={openAlert}
            autoHideDuration={6000}
            onClose={() => setOpenAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setOpenAlert(false)}
              severity="warning"
              sx={{
                width: '100%',
                direction: 'rtl',
                '& .MuiAlert-icon': {
                  marginRight: '16px',
                  marginLeft: '16px'
                },
                '& .MuiAlert-message': {
                  padding: '8px 0'
                },
                '& .MuiAlert-action': {
                  paddingLeft: '16px',
                  marginLeft: '8px'
                }
              }}
            >
              עליך להתחבר כדי לפרסם מגילה
            </Alert>
          </Snackbar>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      <Box sx={{ padding: '20px', marginRight: '20%' }}>
        {noProducts ? (
          <Alert
            severity="warning"
            sx={{
              marginBottom: 2,
              width: '100%',
              maxWidth: '600px',
              direction: 'rtl',
              '& .MuiAlert-icon': {
                marginRight: 2,
                marginLeft: 2
              },
            }}
          >
            לא נמצאו מוצרים מתאימים
          </Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              maxWidth: '100%',
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              justifyContent: 'start',
              '@media (max-width: 1200px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              },
              '@media (max-width: 600px)': {
                gridTemplateColumns: '1fr',
              },
            }}
          >
            {[...filteredProducts]
              .sort((a, b) => (b.isPremiumAd ? 1 : 0) - (a.isPremiumAd ? 1 : 0))
              .map((product) => (
                <Box key={product._id} sx={{ marginBottom: 2 }}>
                  <ProductCard product={product} onOpenModal={handleOpenModal} />
                </Box>
              ))}
          </Box>
        )}
        {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
      </Box>
      <FilterComponent onFilter={handleFilter} products={products} />
    </>
  );
};

export default ProductList;
