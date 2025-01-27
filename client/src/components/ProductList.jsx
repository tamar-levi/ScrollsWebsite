import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/productsApi/getAllProducts');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
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

  return (
    <>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={() => navigate('/add-product')}>
          להוספת מוצר
        </Button>
      </Stack>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          justifyContent: 'center',
        }}
      >
        {products.map((product) => (
          <div
            style={{
              width: 'calc(33.33% - 22px)',
              marginBottom: '32px',
            }}
          >
            <ProductCard key={product._id} product={product} onOpenModal={handleOpenModal} />
          </div>
        ))}
        {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
      </div>
    </>
  );
};

export default ProductList;
