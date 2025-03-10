import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import AddProduct from './AddProduct';
import Info from './Info';
import InfoMobile from './InfoMobile';
import { Link } from 'react-router-dom';
import NedarimPayment from './NedarimPayment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import image from '../assets/Contact.png';
import { createGlobalStyle } from 'styled-components';

const steps = ['פרטי המוצר', 'תשלום', 'סיום'];

export default function Checkout() {
    const [activeStep, setActiveStep] = useState(0);
    const [productData, setProductData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <AddProduct onNext={handleNext} onFormSubmit={handleProductData} productData={productData} />;
            case 1:
                return <NedarimPayment onNext={handleNext} onBack={handleBack} productData={productData} />
            default:
                throw new Error('Unknown step');
        }
    }

    const handleNext = async () => {
        if (activeStep === 1) {
            await addProduct(productData);
        }
        else {
            if (activeStep <= 1) { setActiveStep((prev) => prev + 1); }
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleProductData = (data) => {
        setProductData(data);
    };

    const addProduct = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('scriptType', productData.scriptType);
            formData.append('scrollType', productData.scrollType);
            formData.append('price', productData.price);
            formData.append('note', productData.note);
            formData.append('isPremiumAd', productData.isPremiumAd);
            formData.append('primaryImage', productData.primaryImage);
            productData.additionalImages.forEach((image) => {
                formData.append('additionalImages', image);
            });
            const token = localStorage.getItem('token');
            const response = await fetch('https://scrolls-website.onrender.com/productsApi/addProduct', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });
            if (response.ok) {
                console.log('Product added successfully');
                setActiveStep((prev) => prev + 1);
            } else {
                setErrorMessage("שגיאה בהוספת המוצר, אנא פנה למנהל המערכת לזיכוי התשלום. מתנצלים.");
                setOpenErrorSnackbar(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage("שגיאה בהוספת המוצר, אנא פנה למנהל המערכת לזיכוי התשלום. מתנצלים.");
            setOpenErrorSnackbar(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }
    `;

    return (
        <>
         <GlobalStyle />
            <Box sx={{
                position: 'relative',
                minHeight: '100vh',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}>
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: '0.8',
                    zIndex: 0
                }} />

                <Box sx={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                    <Grid container sx={{
                        mt: { xs: 4, sm: 8 },
                        direction: 'rtl',
                        justifyContent: 'center',
                    }}>
                        <Grid item xs={12} sm={5} lg={4} sx={{
                            order: { sm: 1 },
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            alignItems: 'start',
                            pt: 6,
                            px: 40,
                            gap: 4,
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                width: '100%',
                                maxWidth: 600,
                                textAlign: 'right',
                                '& .MuiTypography-root': {
                                    textAlign: 'right'
                                },
                                '& .MuiFormControl-root': {
                                    textAlign: 'right'
                                }
                            }}>
                                <Info />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={12} md={7} lg={8} sx={{
                            order: { sm: 2 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '100%',
                            width: '100%',
                            pt: { xs: 0, sm: 6 },
                            px: { xs: 2, sm: 10 },
                            gap: { xs: 4, md: 8 },
                            overflow: 'hidden',
                            marginRight: { 
                                xs: 'auto',
                                sm: 'auto',
                                md: '450px'
                            },
                            marginLeft: 'auto',
                        }}>
                            <Card sx={{
                                display: { xs: 'flex', md: 'none' },
                                width: '100%',
                                mb: 2,
                                mt: 3,
                                padding: 0
                            }}>
                                <CardContent sx={{
                                    display: 'flex',
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    padding: '4px !important',
                                    '&:last-child': {
                                        paddingBottom: '4px !important'
                                    },
                                    '& > *': {
                                        textAlign: 'center'
                                    }
                                }}>
                                    <InfoMobile />
                                </CardContent>
                            </Card>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: '90%',
                                mt: -5,
                                mb: 5,
                            }}>
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                    <Typography sx={{
                                        background: 'rgba(230, 219, 201, 1)',
                                        borderRadius: '39px',
                                        color: 'rgba(0, 0, 0, 1)',
                                        fontFamily: 'Heebo, sans-serif',
                                        padding: '1px 20%',
                                        textAlign: 'center',
                                        width: 'fit-content',
                                        marginBottom: '40px',
                                        fontWeight: 'bold',
                                    }}>
                                        פרסום מגילה
                                    </Typography>

                                    <Box sx={{ width: '110%', maxWidth: '900px' }}>
                                        <Stepper id="desktop-stepper" activeStep={activeStep} sx={{
                                            display: { xs: 'none', md: 'flex' },
                                            width: '100%',
                                            height: 40,
                                            '& .MuiStepConnector-line': {
                                                borderColor: 'rgba(0, 0, 0, 1)',
                                                borderWidth: 1,
                                            },
                                            '& .MuiStepIcon-root.Mui-completed': {
                                                color: 'rgba(90, 59, 65, 1)',
                                                width: 40,
                                                height: 40,
                                                '& .MuiStepIcon-text': {
                                                    fill: '#ffffff'
                                                }
                                            },
                                            '& .MuiStepIcon-root.Mui-active': {
                                                color: 'rgba(90, 59, 65, 1)',
                                                width: 40,
                                                height: 40,
                                                '& .MuiStepIcon-text': {
                                                    fill: '#ffffff'
                                                }
                                            },
                                            '& .MuiStepIcon-root': {
                                                color: 'rgba(236, 233, 227, 1)',
                                                width: 40,
                                                height: 40,
                                                '& .MuiStepIcon-text': {
                                                    fill: 'rgba(0, 0, 0, 1)'
                                                }
                                            },
                                        }}>
                                            {steps.map((label) => (
                                                <Step key={label} sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}>
                                                    <StepLabel sx={{
                                                        '& .MuiStepLabel-iconContainer': {
                                                            paddingLeft: '8px',
                                                        },
                                                        '& .MuiStepLabel-labelContainer': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }} />
                                                </Step>
                                            ))}
                                        </Stepper>

                                        <Stepper id="mobile-stepper" activeStep={activeStep} alternativeLabel sx={{
                                            display: { xs: 'flex', md: 'none' },
                                            '& .MuiStepConnector-root': {
                                                display: 'none'
                                            }
                                        }}>
                                            {steps.map((label) => (
                                                <Step key={label} sx={{
                                                    ':first-child': { pl: 0 },
                                                    ':last-child': { pr: 0 },
                                                    '& .MuiStepConnector-root': { top: { xs: 4, sm: 12 } },
                                                }}>
                                                    <StepLabel sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '90px' } }}>
                                                        {label}
                                                    </StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: '600px',
                                mt: -8,
                                px: { xs: 2, sm: 4 },
                            }}>
                                {activeStep === steps.length - 1 ? (
                                    <Stack spacing={2} useFlexGap sx={{
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        fontFamily: 'Heebo, sans-serif',
                                        width: '100%',
                                    }}>
                                        <Typography variant="h2" sx={{ mt: 4 }}>📜</Typography>
                                        <Typography variant="h5" sx={{ fontFamily: 'Heebo, sans-serif' }}>
                                            המוצר שלך נוסף בהצלחה
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 3 }}>
                                            <Button
                                                component={Link}
                                                to="/products"
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: 'rgba(63, 65, 78, 1)',
                                                    borderRadius: '25px',
                                                    color: 'white',
                                                    padding: '1px 10%',
                                                    fontFamily: 'Heebo, sans-serif',
                                                    fontSize: '1rem',
                                                    fontWeight: 300,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(63, 65, 78, 1)',
                                                    },
                                                }}
                                            >
                                                מעבר לדף המוצרים
                                            </Button>
                                        </Box>
                                    </Stack>
                                ) : (
                                    <Box sx={{ width: '100%' }}>
                                        {getStepContent(activeStep)}
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Snackbar open={openErrorSnackbar} onClose={() => setOpenErrorSnackbar(false)} autoHideDuration={5000} sx={{ direction: 'rtl' }}>
                    <Alert severity="error" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        '& .MuiAlert-icon': {
                            marginRight: 2,
                        },
                        '& .MuiAlert-action': {
                            marginLeft: 2,
                        }
                    }}>
                        שגיאה בהוספת המוצר, אנא פנה למנהל המערכת לזיכוי התשלום. אנו מתנצלים על אי הנוחות.
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}
