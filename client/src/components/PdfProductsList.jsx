import React, { useState, useEffect } from 'react';
import PdfProductCard from './PdfProductCard';
import { Box } from '@mui/material';

const ProductList = () => {
    const [products, setProducts] = useState([]);
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

    return (
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
            {products.map((product) => (
                <Box key={product._id} sx={{ marginBottom: 2 }}>
                    <PdfProductCard product={product} sellerId={product.userId} />
                </Box>
            ))}
        </Box>
    );
};

export default ProductList;
