import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditableProductCard from './EditableProductCard';
import EditProductModal from './EditProductModal';
import { Box, Grid, Typography, useMediaQuery, useTheme, CircularProgress, Button } from '@mui/material';
import { Scroll } from 'lucide-react';
import { createGlobalStyle } from 'styled-components';
import background from '../assets/About.png';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found');
                    return;
                }
                const response = await axios.get('https://scrolls-website.onrender.com/productsApi/getAllProductsByUser', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching user products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProducts();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    const handleOpenEditModal = (product) => {
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
                    left: 0,
                    right: 0,
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
                <Button
                    variant="outlined"
                    onClick={() => navigate('/add-product')}
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
                            xs: '80px',
                            sm: '55px',
                            md: '60px'
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
                    פרסום מגילה נוספת
                </Button>
                <Box sx={{ zIndex: 1, padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ mb: 5, fontWeight: 200, textAlign: 'center', fontFamily: 'Heebo, sans-serif', color: '#fff' }}
                    >
                        .לא ינתן החזר על מחיקת מודעה <br />
                        .ניתן לערוך את פרטי המגילה, את המחיר ניתן לשנות עד תקרת הסכום של עלות פרסום המודעה
                    </Typography>
                    {products.length === 0 && (
                        <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mb: 4, fontFamily: 'Heebo, sans-serif', color: '#fff' }}>
                            עדיין לא הוספת מגילות
                        </Typography>
                    )}
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
