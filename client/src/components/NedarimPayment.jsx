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
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const navigate = useNavigate();
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://scrolls-website.onrender.com/usersApi/getCurrentUser', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                console.log("User response:", response);
                if (!response.data) throw new Error("No user data received");
                setCurrentUser(response.data);
            } catch (error) {
                console.error("Error fetching user:", error.response ? error.response.data : error.message);
                setErrorSnackbarMessage('שגיאה בהבאת פרטי המשתמש');
                setOpenErrorSnackbar(true);
                setDisableButton(true);
                setTimeout(() => navigate('/'), 2000);
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchCurrentUser();

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
                        setTimeout(() => onNext(), 1000);
                    } else {
                        const errorMessage = event.data.Value?.Message || "שגיאה בביצוע התשלום";
                        setOpenErrorSnackbar(true);
                        setErrorSnackbarMessage(errorMessage);
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
    }, [navigate, onNext]);

    const sendPaymentRequest = () => {
        if (!currentUser || !currentUser.fullName || !currentUser.email) {
            setOpenErrorSnackbar(true);
            setDisableButton(false);
            setTimeout(() => navigate('/'), 2000);
            return;
        }
        setLoading(true);
        setPaymentInProgress(true);
        setDisableButton(true);

        const iframeWin = iframeRef.current.contentWindow;
        iframeWin.postMessage({
            Name: "FinishTransaction2",
            Value: {
                Mosad: "7014113",
                ApiValid: "5tezOx+JDY",
                Zeout: '',
                PaymentType: "Ragil",
                Currency: "1",
                FirstName: currentUser.fullName,
                LastName: '',
                Street: '',
                City: currentUser.city || '',
                Phone: currentUser.phoneNumber || '',
                Mail: currentUser.email,
                Amount: calculatePaymentAmount(productData?.price),
                Tashlumim: "1",
                Comment: "תשלום",
                Groupe: '',
                Param1: '',
                Param2: '',
                CallBack: 'https://scrolls-website.onrender.com/paymentApi/payment-callback',
                CallBackMailError: 'scrollsSite@gmail.com',
            },
        }, "*");
    };

    function calculatePaymentAmount(price) {
        if (!price) return 40 + (productData.isPremiumAd ? 20 : 0);
        if (price <= 6000) return 30 + (productData.isPremiumAd ? 20 : 0);
        if (price <= 12000) return 35 + (productData.isPremiumAd ? 20 : 0);
        return 40 + (productData.isPremiumAd ? 20 : 0);
    }

    if (isLoadingUser) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <div style={{ marginTop: "-5px", width: '100%' }}>
                <Typography sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px', direction: "rtl", fontFamily: 'Heebo, sans-serif', color: 'rgba(63, 65, 78, 1)', fontWeight: 'bold', fontSize: '1.1rem' }}>
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
                        sx={{
                            borderRadius: '25px',
                            padding: '1px 5%',
                            fontFamily: 'Heebo, sans-serif',
                            fontSize: '1rem',
                            fontWeight: 300,
                            borderColor: 'rgba(63, 65, 78, 1)',
                            color: 'rgba(63, 65, 78, 1)',
                            '&:hover': {
                                borderColor: 'rgba(63, 65, 78, 1)',
                                backgroundColor: 'transparent',
                            },
                        }}
                        disabled={disableButton}
                    >
                        חזור
                    </Button>
                    <Button
                        onClick={sendPaymentRequest}
                        endIcon={<PaymentIcon style={{ marginRight: '8px' }} />}
                        variant="contained"
                        sx={{
                            backgroundColor: 'rgba(63, 65, 78, 1)',
                            borderRadius: '25px',
                            color: 'white',
                            padding: '1px 5%',
                            fontFamily: 'Heebo, sans-serif',
                            fontSize: '1rem',
                            fontWeight: 300,
                            '&:hover': {
                                backgroundColor: 'rgba(63, 65, 78, 1)',
                            },
                        }}
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
                    <Alert severity="success">תשלום בוצע בהצלחה!</Alert>
                </Snackbar>
                <Snackbar open={openErrorSnackbar} onClose={() => setOpenErrorSnackbar(false)} autoHideDuration={5000} sx={{ direction: 'rtl' }}>
                    <Alert severity="error">{errorSnackbarMessage}</Alert>
                </Snackbar>
            </div>
            <Snackbar
                open={showAddingProductSnackbar}
                onClose={() => setShowAddingProductSnackbar(false)}
                autoHideDuration={8000}
                sx={{ direction: 'rtl' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info">מוסיף את המוצר שלך, אנא המתן...</Alert>
            </Snackbar>
        </>
    );
};

export default NedarimPayment;