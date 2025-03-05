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
        const response = await fetch('http://localhost:5000/productsApi/getAllProducts', {
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        width: '100%',
        padding: 4,
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
              position: 'absolute',
              width: '310px',
              height: '45px',
              left: 'calc(50% - 580px/2)',
              top: '90px',
              borderRadius: '50px',
              backgroundColor: '#E6DBC9',
              color: '#5A3B41',  
              fontWeight: 'bold',
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
        const filtered = products.filter((product) => {
          const isPriceInRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
          const isFontTypeMatch = filters.fontType ? product.scriptType === filters.fontType : true;
          const isScrollTypeMatch = filters.scrollType ? product.scrollType === filters.scrollType : true;
          const isCityMatch = filters.city ? product.userId.city === filters.city : true;
          const isSellerMatch = filters.seller ? product.userId?.displayName === filters.seller : true;
          return isPriceInRange && isFontTypeMatch && isScrollTypeMatch && isCityMatch && isSellerMatch;
        });
        setFilteredProducts(filtered);
        setNoProducts(filtered.length === 0);
      }} products={products} />
    </Box>
  );
};

export default ProductList;
