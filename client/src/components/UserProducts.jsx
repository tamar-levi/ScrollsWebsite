import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditableProductCard from './EditableProductCard';
import EditProductModal from './EditProductModal';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // For mobile screens

    useEffect(() => {
        const fetchUserProducts = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/productsApi/getAllProductsByUser', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user products:', error);
                setLoading(false);
            }
        };
        fetchUserProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleOpenEditModal = (product) => {
        console.log('Opening modal with product:', product);
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDelete = (productId) => {
        setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
    };

    return (
        <>
            <Box sx={{
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        marginBottom: '30px',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Adjust font size based on screen size
                    }}
                >
                    המוצרים שלי
                </Typography>
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <EditableProductCard
                                product={product}
                                onDelete={handleDelete}
                                onOpenEditModal={handleOpenEditModal}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {isEditModalOpen && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    open={isEditModalOpen}
                    onClose={handleCloseModal}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
};

export default UserProducts;
