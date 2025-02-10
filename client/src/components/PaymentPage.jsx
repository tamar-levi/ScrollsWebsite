import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Typography, Box, Alert } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

const PaymentPage = ({ onNext, onBack, productData = { price: 100 } }) => {
    const [height, setHeight] = useState(500);
    const [paymentStatus, setPaymentStatus] = useState(null);
    
    const currentUser = useSelector((state) => state.user.currentUser);

    const [paymentData, setPaymentData] = useState({
        Mosad: '7014113',
        ApiValid: '5tezOx+JDY',
        Zeout: '',
        FirstName: currentUser?.FirstName || '',
        LastName: currentUser?.LastName || '',
        Street: '',
        City: currentUser?.city || '',
        Phone: currentUser?.phoneNumber || '',
        Mail: currentUser?.email || '',
        PaymentType: 'Ragil',  
        Amount: productData?.price >= 1000 ? productData.price : '',
        Tashlumim: '1',
        Currency: '1',
        Groupe: '',
        Comment: '',
        Param1: '',
        Param2: '',
        CallBack: 'http://localhost:5000/paymentApi/payment-callback',
        CallBackMailError: 'scrollsSite@gmail.com',
    });

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin === 'https://www.matara.pro') {
                const data = event.data;
                if (data.status === 'success') {
                    setPaymentStatus('success');
                } else if (data.status === 'failure') {
                    setPaymentStatus('failure');
                }
                if (data.height) {
                    setHeight(data.height);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const generateIframeUrl = () => {
        const params = new URLSearchParams(paymentData);
        return `https://www.matara.pro/nedarimplus/iframe/?${params.toString()}`;
    };

    const handleNextStep = () => {

        if (paymentStatus === 'success' || productData?.price < 1000) {
            onNext();  
        }
    };

    return (
        <div style={{ marginTop: '4rem' }}>
            <Typography
                variant="h6"
                sx={{
                    direction: 'rtl',
                    color: 'primary.main',
                    fontSize: '0.9rem',
                    marginTop: '2%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    fontFamily: 'Assistant, Rubik, sans-serif',
                    fontWeight: 300,
                    width: '100%'
                }}
            >
                {productData?.price < 1000 ? (
                    "מודעות עד 1000 ש״ח ללא עלות"
                ) : productData?.price <= 1500 ? (
                    "עלות: 15 ש״ח"
                ) : productData?.price <= 2000 ? (
                    "עלות: 20 ש״ח"
                ) : null}
                <CurrencyExchangeIcon sx={{ marginRight: '16px' }} />
            </Typography>

            {productData?.price >= 1000 && (
                <iframe
                    id="paymentIframe"
                    src={generateIframeUrl()}
                    width="100%"
                    height={height}
                    frameBorder="0"
                ></iframe>
            )}

            {paymentStatus === 'success' && <Alert severity="success">התשלום הצליח!</Alert>}
            {paymentStatus === 'failure' && <Alert severity="error">התשלום נכשל. נסה שוב.</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                <Button
                    onClick={onBack}
                    variant="text"
                    startIcon={<ArrowForward sx={{ marginLeft: '10px' }}/>}>
                    הקודם
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNextStep}
                    endIcon={<ArrowBack sx={{ marginRight: '10px' }} />}
                    disabled={productData?.price >= 1000 && paymentStatus !== 'success'}
                >
                    סיום
                </Button>
            </Box>
        </div>
    );
};

export default PaymentPage;
