import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Typography,
    Box,
    CircularProgress,
    Fade,
    Alert,
    IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import LocationCityIcon from '@mui/icons-material/LocationCityOutlined';
import CloseIcon from '@mui/icons-material/Close';

const SellerInfo = React.memo(({ icon: Icon, label, value }) => (
    <Fade in={true} timeout={300}>
        <Typography sx={{
            display: 'flex',
            gap: 1.5,
            fontSize: '16px',
            color: 'rgba(71, 81, 90, 1)',
            fontFamily: 'Heebo, sans-serif',
            textAlign: 'right'
        }}>
            <Icon color="rgba(90, 59, 65, 1)" fontSize='20%' /> {label}{value}
        </Typography>
    </Fade>
));

const SellerDetailsModal = ({ sellerId, isOpen, onClose }) => {
    const [seller, setSeller] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSellerDetails = useCallback(async () => {
        if (!sellerId) return;
        try {
            const response = await fetch(`https://scrolls-website.onrender.com/usersApi/getUserById/${sellerId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch seller details');
            const data = await response.json();
            setSeller(data);
        } catch (error) {
            setError('שגיאה בטעינת פרטי המוכר');
            console.error('Error:', error);
        }
    }, [sellerId]);

    useEffect(() => {
        if (sellerId) {
            fetchSellerDetails();
        }
        return () => {
            setSeller(null);
            setError(null);
        };
    }, [sellerId, fetchSellerDetails]);

    const handleCallClick = () => {
        if (seller?.phoneNumber) {
            window.location.href = `tel:${seller.phoneNumber}`;
        }
    };

    const dialogStyles = useMemo(() => ({
        '& .MuiDialog-paper': {
            backgroundColor: '#f8f9fa',
            borderRadius: '25px',
            overflow: 'hidden',
            width: '700px',
            height: '450px',
        },
    }), []);

    const sellerDetails = useMemo(() => (
        seller && (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                paddingBottom: '8px',
                alignItems: 'flex-start',
                width: '100%'
            }}>
                <SellerInfo
                    icon={PersonIcon}
                    label={<span style={{ fontWeight: 'bold' }}>שם:</span>}
                    value={seller.displayName || seller.fullName}
                />
                <SellerInfo
                    icon={EmailIcon}
                    label={<span style={{ fontWeight: 'bold' }}>מייל:</span>}
                    value={seller.email}
                />
                <SellerInfo
                    icon={PhoneIcon}
                    label={<span style={{ fontWeight: 'bold' }}>טלפון:</span>}
                    value={seller.phoneNumber !== '0' ? seller.phoneNumber : 'לא צוין'}
                />
                <SellerInfo
                    icon={LocationCityIcon}
                    label={<span style={{ fontWeight: 'bold' }}>עיר:</span>}
                    value={seller.city}
                />
            </Box>
        )
    ), [seller]);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            dir="rtl"
            TransitionComponent={Fade}
            sx={dialogStyles}
        >
            <DialogContent sx={{
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
                height: '100%'
            }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: 'rgba(71, 81, 90, 1)',
                        backgroundColor: 'rgba(230, 219, 201, 1)',
                        borderRadius: '50%',
                        padding: '6px',
                        '&:hover': {
                            backgroundColor: 'rgba(190, 185, 173, 1)',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography
                    sx={{
                        background: 'rgba(230, 219, 201, 1)',
                        borderRadius: '39px',
                        color: 'rgba(0, 0, 0, 1)',
                        fontFamily: 'Heebo, sans-serif',
                        fontWeight: 'bold',
                        padding: '5px 80px',
                        textAlign: 'center',
                        width: 'fit-content',
                        marginBottom: '20px'
                    }}
                >
                    פרטי יצירת קשר עם המוכר
                </Typography>

                {isLoading && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px'
                    }}>
                        <CircularProgress size={40} />
                    </Box>
                )}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ marginTop: 2 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                {!isLoading && !error && (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        paddingTop: '24px',
                        paddingBottom: '8px',
                        alignItems: 'flex-end',
                    }}>
                        {sellerDetails}
                    </Box>
                )}

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '20px',
                    width: '100%',
                }}>
                    <Button
                        onClick={handleCallClick}
                        variant="contained"
                        sx={{
                            width: '150px',
                            gap: '6px',
                            backgroundColor: 'rgba(71, 81, 90, 1)',
                            borderRadius: '24px',
                            fontFamily: 'Heebo, sans-serif',
                            height: '30px',
                            minHeight: '30px',
                            color: '#fff',
                            fontWeight: 'normal'
                        }}
                    >
                        התקשר
                    </Button>

                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            width: '150px',
                            gap: '6px',
                            backgroundColor: 'rgba(71, 81, 90, 1)',
                            borderRadius: '24px',
                            fontFamily: 'Heebo, sans-serif',
                            height: '30px',
                            minHeight: '30px',
                            color: '#fff',
                            fontWeight: 'normal'
                        }}
                    >
                        סגור
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default React.memo(SellerDetailsModal);
