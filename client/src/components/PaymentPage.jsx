import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { ArrowForward, ArrowBack, Payment } from '@mui/icons-material';

const PaymentPage = ({ onNext, onBack, productData }) => {
    const [height, setHeight] = useState(500);
    const [paymentStatus, setPaymentStatus] = useState(''); // ערך ברירת מחדל
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef(null);
    const currentUser = useSelector((state) => state.user?.currentUser) || {};

    const paymentData = useMemo(() => ({
        Mosad: '7014113',
        ApiValid: '5tezOx+JDY',
        Zeout: '',
        FirstName: currentUser.fullName || '',
        LastName: '',
        Street: '',
        City: currentUser.city || '',
        Phone: currentUser.phoneNumber || '',
        Mail: currentUser.email || '',
        PaymentType: 'Ragil',  
        Amount: calculatePaymentAmount(productData?.price), 
        Tashlumim: '1',
        Currency: '1',
        Groupe: '',
        Comment: `תשלום עבור ${productData?.title || 'מוצר'}`,
        Param1: '',
        Param2: '',
        CallBackMailError: 'scrollsSite@gmail.com',
    }), [currentUser, productData]);

    function calculatePaymentAmount(price) {
        if (price > 1000 && price < 1500) return 5;
        if (price >= 1500 && price < 2000) return 15;
        if (price >= 2000) return 20;
        return 0;
    }

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.onload = () => {
                console.log('האייפריים נטען בהצלחה');
            };
        }
    }, []);

    const generateIframeUrl = useMemo(() => {
        const params = new URLSearchParams(paymentData);
        console.log('URL שנוצר: ', `https://www.matara.pro/nedarimplus/iframe/?${params.toString()}`);
        return `https://www.matara.pro/nedarimplus/iframe/?${params.toString()}`;
    }, [paymentData]);

    const handlePayment = () => {
        const messageHandler = (event) => {
            console.log('messageHandler הופעל'); // log לתחילת הפונקציה
    
            if (event.origin !== 'https://www.matara.pro') {
                console.error('התגובה לא מגיעה מהכתובת הנכונה');
                return;
            }
    
            if (event.type !== 'message') {
                console.error('סוג הודעה שגוי:', event.type);
                return;
            }
    
            setIsLoading(false);
            window.removeEventListener('message', messageHandler);
    
            try {
                const data = JSON.parse(event.data); // פענוח JSON
                console.log('התקבלה תגובה:', data);
    
                if (data.status === 'success') {
                    console.log('הודעה - התשלום הצליח');
                    alert('התשלום בוצע בהצלחה!');
                } else if (data.status === 'failure') {
                    console.error('הודעה - התשלום נכשל');
                    alert('התשלום נכשל. אנא נסה שוב.');
                } else {
                    console.error('תגובה לא מוכרת:', data);
                    alert('אירעה שגיאה. אנא נסה שוב.');
                }
            } catch (error) {
                console.error('שגיאה בעיבוד התגובה:', error);
                alert('אירעה שגיאה. אנא נסה שוב.');
            }
        };
    
        window.addEventListener('message', messageHandler);
        console.log('הוספנו את ה-event listener');
    
        setIsLoading(true);
    
        if (!iframeRef.current || !iframeRef.current.contentWindow) {
            console.error('לא נמצא אייפריים או חלון תוכן');
            alert('טוען את טופס התשלום מחדש...');
            window.location.reload();
            return;
        }
    
        console.log('שולחים את ההודעה ל-iFrame');
        iframeRef.current.contentWindow.postMessage('pay', 'https://www.matara.pro');
    
        // timeout דינמי (10 שניות)
        const timeout = setTimeout(() => {
            setIsLoading(false);
            console.error('לא התקבלה תגובה מה-iFrame');
            alert('לא התקבלה תגובה מהשרת, אנא נסה שוב');
            window.removeEventListener('message', messageHandler);
        }, 10000);
    };

    return (
        <Box sx={{ marginTop: '4rem', position: 'relative' }}>
            {isLoading && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 1000
                }}>
                    <CircularProgress />
                </Box>
            )}

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
                    fontFamily: 'Assistant, Rubik, sans-serif',
                    fontWeight: 300,
                    width: '100%'
                }}
            >
                {productData?.price < 1000 ? (
                    "מודעות עד 1000 ש״ח ללא עלות"
                ) : (
                    `עלות: ${calculatePaymentAmount(productData?.price)} ש״ח`
                )}
                <CurrencyExchangeIcon sx={{ marginRight: '16px' }} />
            </Typography>

            {productData?.price >= 1000 && (
                <Box sx={{ mt: 2 }}>
                    <iframe
                        ref={iframeRef}
                        src={generateIframeUrl}
                        width="100%"
                        height={height}
                        frameBorder="0"
                        title="טופס תשלום"
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePayment}
                        startIcon={<Payment />}
                        disabled={isLoading}
                        sx={{ 
                            mt: 2,
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#115293'
                            }
                        }}
                    >
                        {isLoading ? 'מעבד תשלום...' : 'בצע תשלום'}
                    </Button>
                </Box>
            )}

            {paymentStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    התשלום בוצע בהצלחה!
                </Alert>
            )}
            
            {paymentStatus === 'failure' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    התשלום נכשל. אנא נסה שוב.
                </Alert>
            )}

            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '100%', 
                mt: 3,
                mb: 2
            }}>
                <Button
                    onClick={onBack}
                    variant="text"
                    startIcon={<ArrowForward />}
                    disabled={isLoading}
                >
                    הקודם
                </Button>
                
                <Button
                    variant="contained"
                    onClick={onNext}
                    endIcon={<ArrowBack />}
                    disabled={
                        (paymentStatus !== 'success' && productData?.price >= 1000) || 
                        isLoading
                    }
                >
                    סיום
                </Button>
            </Box>
        </Box>
    );
};

export default PaymentPage;
