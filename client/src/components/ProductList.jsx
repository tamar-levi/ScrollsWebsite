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
import background from '../assets/About.png';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    width: 100%;
    position: relative;
  }
`;

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
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          overflow: 'hidden', 
        }}
      >

        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#47515A',
          opacity: 0.83,
          zIndex: 0,
        }} />

        <Box sx={{ zIndex: 1, marginTop: 8, marginRight: '20%' }}>
          <Stack spacing={2} direction="row">
            <Button
              variant="outlined"
              onClick={() => {
                if (!user) {
                  setOpenAlert(true);
                } else {
                  navigate('/add-product');
                }
              }}
              startIcon={<AddIcon />}
              sx={{
                width: {
                  xs: '250px',
                  sm: '280px',
                  md: '300px'
                },
                height: {
                  xs: '30px',
                  sm: '32px',
                  md: '35px'
                },
                borderRadius: '50px',
                backgroundColor: '#E6DBC9',
                color: '#5A3B41',
                border: 'none',
                fontSize: {
                  xs: '90%',
                  sm: '100%',
                  md: '120%'
                },
                fontFamily: 'Heebo, sans-serif',
                marginTop: {
                  xs: '15px',
                  sm: '18px',
                  md: '20px'
                },
                marginBottom: {
                  xs: '15px',
                  sm: '18px',
                  md: '20px'
                },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
                padding: '0',
              }}
            >
              פרסום המגילה שלך
            </Button>

            <Snackbar
              open={openAlert}
              autoHideDuration={6000}
              onClose={() => setOpenAlert(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              sx={{ top: '100px !important' }}
            >
              <Alert severity="warning" onClose={() => setOpenAlert(false)}>
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

        <Box sx={{ zIndex: 1, padding: '20px', marginRight: '20%' }}>
          {noProducts ? (
            <Alert severity="warning">לא נמצאו מוצרים מתאימים</Alert>
          ) : (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 3,
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
            }}>
              {[...filteredProducts]
                .sort((a, b) => (b.isPremiumAd ? 1 : 0) - (a.isPremiumAd ? 1 : 0))
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onOpenModal={() => setSelectedProduct(product)}
                  />
                ))}
            </Box>
          )}
          {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </Box>

        <FilterComponent onFilter={(filters) => {
          console.log(filters);
          const filtered = products.filter((product) => {
            const normalizedProductFont = product.scriptType?.replace(/['"]/g, '');
            const isPriceInRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
            const isFontTypeMatch = filters.fontType ? normalizedProductFont === filters.fontType.replace(/['"]/g, '') : true;
            console.log(product.scriptType, isFontTypeMatch);
            const isScrollTypeMatch = filters.scrollType ? product.scrollType === filters.scrollType : true;
            const isCityMatch = filters.city ? product.userId.city === filters.city : true;
            const isSellerMatch = filters.seller ? product.userId?.displayName === filters.seller : true;
            return isPriceInRange && isFontTypeMatch && isScrollTypeMatch && isCityMatch && isSellerMatch;
          });
          setFilteredProducts(filtered);
          setNoProducts(filtered.length === 0);
        }} products={products} />
      </Box>
    </>
  );
};

export default ProductList;
