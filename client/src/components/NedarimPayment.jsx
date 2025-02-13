import { useEffect, useRef, useState } from "react";
import { Button, Typography, Snackbar } from "@mui/material";
import { Payment as PaymentIcon, CheckCircle as CheckCircleIcon, ArrowForward as ArrowForward } from "@mui/icons-material";

const NedarimPayment = ({ productData = { price: 50 }, onBack, onNext }) => {
    const iframeRef = useRef(null);
    const [transactionResult, setTransactionResult] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(true);

    useEffect(() => {
        const handleMessage = (event) => {
            console.log("Received event:", event.data);
            if (!event.data?.Name) return;

            switch (event.data.Name) {
                case "Height":
                    iframeRef.current.style.height = `${parseInt(event.data.Value) + 15}px`;
                    break;
                case "TransactionResponse":
                    setTransactionResult(event.data.Value);
                    if (event.data.Value === 'success') {
                        setOpenSnackbar(true);
                        onNext();
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
                    FirstName: "John",
                    LastName: "Doe",
                    Street: "Example St.",
                    City: "Example City",
                    Phone: '',
                    Mail: "example@example.com",
                    Amount: calculatePaymentAmount(productData?.price),
                    Tashlumim: "1",
                    Comment: "בדיקת תשלום",
                    Currency: '1',
                    Groupe: '',
                    Param1: '',
                    Param2: '',
                    CallBackMailError: 'scrollsSite@gmail.com',
                },
            },
            "*"
        );
    };

    function calculatePaymentAmount(price) {
        if (price <= 6000) return 30 + (productData.isPremiumAd ? 20 : 0);
        if (price <= 12000) return 35 + (productData.isPremiumAd ? 20 : 0);
        if (price > 12000) return 40 + (productData.isPremiumAd ? 20 : 0);
        return 40;
    }

    return (
        <div style={{ marginTop: "100px" }}>
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
            <div style={{ display: 'flex', gap: '10px', marginTop: '-130px' , justifyContent: 'space-between' }}>
                <Button
                    onClick={sendPaymentRequest}
                    startIcon={<PaymentIcon />}
                    variant="contained"
                    color="info"
                    sx={{ marginTop: '16px' }}
                >
                    בצע תשלום
                </Button>
                <Button
                    onClick={onBack}
                    endIcon={<ArrowForward />}
                    variant="outlined"
                    sx={{ marginTop: '16px' }}
                >
                    חזור
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

            {transactionResult && <pre>{JSON.stringify(transactionResult, null, 2)}</pre>}
        </div>
    );
};

export default NedarimPayment;
