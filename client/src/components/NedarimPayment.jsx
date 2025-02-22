import { useEffect, useRef, useState } from "react";
import { Button, Typography, Snackbar, CircularProgress, Alert } from "@mui/material";
import { Payment as PaymentIcon, ArrowForward as ArrowForward } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NedarimPayment = ({ productData, onBack, onNext }) => {
    const iframeRef = useRef(null);
    const [transactionResult, setTransactionResult] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentInProgress, setPaymentInProgress] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAddingProductSnackbar, setShowAddingProductSnackbar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('https://scrolls-website.onrender.com/usersApi/getCurrentUser', {
                    withCredentials: true,
                });
                setCurrentUser(response.data);
            } catch (error) {
                setOpenErrorSnackbar(true);  
                setDisableButton(true);
                setTimeout(() => {
                    navigate('/');  
                }, 2000);
            }
        };
        fetchCurrentUser(); 
    }, [navigate]);

    useEffect(() => {
        if (!currentUser) return;
        
        const handleMessage = (event) => {
            if (!event.data?.Name) return;
            switch (event.data.Name) {
                case "Height":
                    iframeRef.current.style.height = `${parseInt(event.data.Value) + 15}px`;
                    break;
                case "TransactionResponse":
                    setTransactionResult(event.data.Value);
                    if (event.data.Value?.Status === 'OK') {
                        setOpenSnackbar(true);
                        setTimeout(() => {
                            onNext();
                        }, 1000);
                    } else {
                        setOpenErrorSnackbar(true);
                        setDisableButton(false);
                    }
                    setLoading(false);
                    setPaymentInProgress(false);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [currentUser, navigate, onNext]);

    useEffect(() => {
        if (!currentUser) {
            setOpenErrorSnackbar(true);
            setDisableButton(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [currentUser, navigate]);

    const sendPaymentRequest = () => {
        setLoading(true);
        setPaymentInProgress(true);
        setDisableButton(true);

        const iframeWin = iframeRef.current.contentWindow;
        iframeWin.postMessage(
            {
                Name: "FinishTransaction2",
                Value: {
                    Mosad: "7014113",
                    ApiValid: "5tezOx+JDY",
                    Zeout: '',
                    PaymentType: "Ragil",
                    Currency: "1",
                    FirstName: currentUser.fullName || '',
                    LastName: '',
                    Street: '',
                    City: currentUser.city || '',
                    Phone: currentUser.phoneNumber || '',
                    Mail: currentUser.email || '',
                    Amount: calculatePaymentAmount(productData?.price),
                    Tashlumim: "1",
                    Comment: "תשלום",
                    Groupe: '',
                    Param1: '',
                    Param2: '',
                    CallBack: 'https://scrolls-website.onrender.com/paymentApi/payment-callback',
                    CallBackMailError: 'scrollsSite@gmail.com',
                },
            },
            "*"
        );
    };

    function calculatePaymentAmount(price) {
        if (!price) return 40 + (productData.isPremiumAd ? 20 : 0);
        if (price <= 6000) return 30 + (productData.isPremiumAd ? 20 : 0);
        if (price <= 12000) return 35 + (productData.isPremiumAd ? 20 : 0);
        if (price > 12000) return 40 + (productData.isPremiumAd ? 20 : 0);
        return 40;
    }

    return (
        <>
            <div style={{ marginTop: "10px" }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px', direction: "rtl" }}>
                    סכום לתשלום: {calculatePaymentAmount(productData?.price)} ₪
                </Typography>
                <iframe
                    ref={iframeRef}
                    src="https://matara.pro/nedarimplus/iframe?language=he"
                    style={{
                        width: "100%",
                        height: "500px",
                        border: "none",
                    }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '-180px', justifyContent: 'space-between' }}>
                    <Button
                        onClick={onBack}
                        startIcon={<ArrowForward style={{ marginLeft: '8px' }} />}
                        variant="outlined"
                        sx={{ marginTop: '16px', marginRight: '16px' }}
                        disabled={disableButton}
                    >
                        חזור
                    </Button>
                    <Button
                        onClick={sendPaymentRequest}
                        endIcon={<PaymentIcon style={{ marginRight: '8px' }} />}
                        variant="contained"
                        sx={{ marginTop: '16px' }}
                        disabled={disableButton || showAddingProductSnackbar}
                    >
                        בצע תשלום
                    </Button>
                </div>

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </div>
                )}
                <Snackbar
                    open={openSnackbar}
                    onClose={() => {
                        setOpenSnackbar(false);
                        setShowAddingProductSnackbar(true);
                    }}
                    autoHideDuration={3000}
                    sx={{ direction: 'rtl' }}
                >
                    <Alert severity="success" sx={{ display: 'flex', alignItems: 'center' }}>
                        תשלום בוצע בהצלחה!
                    </Alert>
                </Snackbar>
                <Snackbar open={openErrorSnackbar} onClose={() => setOpenErrorSnackbar(false)} autoHideDuration={5000} sx={{ direction: 'rtl' }}>
                    <Alert severity="error" sx={{ display: 'flex', alignItems: 'center' }}>
                        שגיאה בהבאת נתוני המשתמש, אנא התחבר מחדש.
                    </Alert>
                </Snackbar>
            </div>
            <Snackbar
                open={showAddingProductSnackbar}
                onClose={() => setShowAddingProductSnackbar(false)}
                autoHideDuration={8000}
                sx={{ direction: 'rtl' }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
                    מוסיף את המוצר שלך, אנא המתן...
                </Alert>
            </Snackbar>
        </>
    );
};

export default NedarimPayment;
