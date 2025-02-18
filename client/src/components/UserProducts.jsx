import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditableProductCard from './EditableProductCard';
import EditProductModal from './EditProductModal';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Mail, Phone, X, Scroll } from 'lucide-react';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); 

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/productsApi/getAllProductsByUser', {
                    withCredentials: true,
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
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1} sx={{ mb: 3, mt: 2 }}>
                    <Scroll size={35} color="#1976d2" />
                    <Typography fontWeight="bold" sx={{ color: '#333', fontSize: '1.5rem' }}>
                        המגילות שלי
                    </Typography>
                </Box>
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ mb: 5, fontWeight: '500', textAlign: 'center' }}
                >
                    .לא ינתן החזר על מחיקת מודעה <br />
                    .ניתן לערוך את פרטי המגילה, את המחיר ניתן לשנות עד תקרת הסכום של עלות פרסום המודעה
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 5,
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
                        <Grid key={product._id} sx={{ marginBottom: 2 }}>
                            <EditableProductCard
                                product={product}
                                onDelete={handleDelete}
                                onOpenEditModal={handleOpenEditModal}
                            />
                        </Grid>
                    ))}
                </Box>
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
