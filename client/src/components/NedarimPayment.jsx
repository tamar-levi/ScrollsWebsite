import { useEffect, useRef, useState } from "react";
import { Button, Typography, Snackbar } from "@mui/material";
import { Payment as PaymentIcon, CheckCircle as CheckCircleIcon, ArrowForward as ArrowForward } from "@mui/icons-material";
import { useSelector } from 'react-redux';

const NedarimPayment = ({ productData, onBack, onNext }) => {
    const iframeRef = useRef(null);
    const [transactionResult, setTransactionResult] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const currentUser = useSelector((state) => state.user?.currentUser) || {};
    useEffect(() => {
        const handleMessage = (event) => {
            console.log("Received event:", event.data);
            if (!event.data?.Name) return;
            switch (event.data.Name) {
                case "Height":
                    iframeRef.current.style.height = `${parseInt(event.data.Value) + 15}px`;
                    break;
                case "TransactionResponse":
                    console.log("Transaction Response:", event.data.Value);
                    setTransactionResult(event.data.Value);
                    console.log("OK", event.data.Value?.Status === 'OK');
                    if (event.data.Value?.Status === 'OK') {
                        setOpenSnackbar(true);
                        setTimeout(() => {
                            onNext();
                        }, 1000);
                    }
                    break;
                default:
                    break;
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [onNext]);

    const sendPaymentRequest = () => {
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
                    Comment: "בדיקת תשלום",
                    Currency: '1',
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
        if (price <= 6000) return 1.2 + (productData.isPremiumAd ? 20 : 0);
        if (price <= 12000) return 35 + (productData.isPremiumAd ? 20 : 0);
        if (price > 12000) return 40 + (productData.isPremiumAd ? 20 : 0);
        return 40;
    }

    return (
        <div style={{ marginTop: "10px" }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px', direction: "rtl" }}>
                סכום לתשלום: {calculatePaymentAmount(productData.price)} ₪
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
                >
                    חזור
                </Button>
                <Button
                    onClick={sendPaymentRequest}
                    endIcon={<PaymentIcon style={{ marginRight: '8px' }} />}
                    variant="contained"
                    sx={{ marginTop: '16px' }}
                >
                    בצע תשלום
                </Button>
            </div>
            <Snackbar
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
                message={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon style={{ marginLeft: '8px' }} />
                        תשלום בוצע בהצלחה!
                    </span>
                }
                autoHideDuration={3000}
                sx={{ direction: 'rtl' }}
            />

            {transactionResult && transactionResult.Status !== "OK" && (
                <pre>{JSON.stringify(transactionResult, null, 2)}</pre>
            )}
        </div>
    );
};

export default NedarimPayment;
