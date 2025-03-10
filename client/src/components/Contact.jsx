import React, { useState } from 'react';
import backgroundImage from '../assets/Contact.png';
import { Typography, Snackbar, Alert } from '@mui/material';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

export default function Contact() {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);  // מצב השליחה

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // בדיקה אם כל השדות מלאים
        if (!formData.email || !formData.name || !formData.message) {
            setAlertMessage('אנא מלא את כל השדות');
            setAlertSeverity('warning');
            setOpenAlert(true);  // פותחים את האלרט
            return;  // אם יש שדה חסר, לא נמשיך לשלוח
        }

        setIsSubmitting(true);  // מתחילים לשלוח, כפתור יהיה דיסאייבל
        console.log(formData);
        try {
            const response = await fetch('https://scrolls-website.onrender.com/usersApi/contactUs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({ email: '', name: '', message: '' });
                setAlertMessage('ההודעה נשלחה בהצלחה!');
                setAlertSeverity('success');
            } else {
                setAlertMessage('שגיאה בשליחת ההודעה, אנא נסו שוב');
                setAlertSeverity('error');
            }
            setOpenAlert(true); // Open the alert
        } catch (error) {
            console.error('Error sending message:', error);
            setAlertMessage('שגיאה בשליחת ההודעה, אנא נסו שוב');
            setAlertSeverity('error');
            setOpenAlert(true); // Open the alert
        } finally {
            setIsSubmitting(false);  // בסיום, כפתור יחזור להיות פעיל
        }
    };

    return (
        <>
            <GlobalStyle />
            <style>
                {`
                input::placeholder {
                    color: white;
                    opacity: 1;
                }
                textarea::placeholder {
                    color: white;
                    opacity: 1; 
                }
                @media (max-width: 768px) {
                    .contact-container {
                        flex-direction: column-reverse !important;
                        height: auto !important;
                        padding: 40px 20px !important;
                    }
                    .form-section {
                        width: 100% !important;
                        margin: 20px 0 !important;
                    }
                    .info-section {
                        width: 100% !important;
                        margin: 20px 0 !important;
                    }
                    .input-group {
                        width: 90% !important;
                    }
                    .message-input {
                        width: 85% !important;
                    }
                    .submit-button {
                        padding: 10px 30% !important;
                    }
                }
                @media (max-width: 480px) {
                    .title-text {
                        font-size: 1.2rem !important;
                        padding: 8px 12% !important;
                    }
                    .input-group {
                        flex-direction: column !important;
                        gap: 15px !important;
                    }
                    .contact-info {
                        font-size: 0.9rem !important;
                    }
                }
                `}
            </style>
            <div className="contact-container" style={{
                width: '100vw',
                height: '90vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                fontFamily: 'Heebo, sans-serif',
                margin: 0,
                padding: 0,
            }}>
                <div className="form-section" style={{
                    width: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    marginLeft: '7%',
                }}>
                    <form onSubmit={handleSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        gap: '20px'
                    }}>
                        <div className="input-group" style={{ display: 'flex', gap: '10px', width: '65%' }}>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="מייל"
                                style={{
                                    flex: 1,
                                    padding: '6px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: '#47515A',
                                    color: 'white',
                                    fontSize: '1rem',
                                    textAlign: 'right',
                                    outline: 'none',
                                    paddingRight: '10px',
                                    fontFamily: 'Heebo, sans-serif',
                                    direction: 'rtl',
                                }}
                            />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="נושא"
                                style={{
                                    flex: 1,
                                    padding: '5px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: '#47515A',
                                    color: 'white',
                                    fontSize: '1rem',
                                    textAlign: 'right',
                                    outline: 'none',
                                    paddingRight: '10px',
                                    fontFamily: 'Heebo, sans-serif',
                                    direction: 'rtl',
                                }}
                            />
                        </div>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="message-input"
                            placeholder="הודעה"
                            rows="2"
                            style={{
                                width: '63%',
                                borderRadius: '60px',
                                textAlign: 'right',
                                border: 'none',
                                background: '#47515A',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'none',
                                padding: '5px',
                                paddingRight: '25px',
                                fontFamily: 'Heebo, sans-serif',
                                direction: 'rtl',
                            }}
                        ></textarea>
                        <button
                            type="submit"
                            className="submit-button"
                            style={{
                                backgroundColor: 'rgba(90, 59, 65, 1)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '0.8% 30%',
                                borderRadius: '50px',
                                fontSize: '1.1rem',
                                border: 'none',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer', // אם אנחנו בשלב של שליחה, הכפתור יהיה דיסאייבל
                                marginTop: '10px',
                                outline: 'none',
                            }}
                            disabled={isSubmitting}  // אם אנחנו בשלב של שליחה, הכפתור יהיה דיסאייבל
                        >
                            {isSubmitting ? 'שליחה...' : 'שלח'}
                        </button>
                    </form>
                </div>
                <div className="info-section" style={{
                    width: '40%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'rgba(90, 59, 65, 1)',
                    fontSize: '1.1rem',
                    gap: '10px',
                    marginRight: '10%',
                    marginLeft: '-5%',
                }}>
                    <Typography
                        className="title-text"
                        sx={{
                            background: '#E6DBC9',
                            borderRadius: '39px',
                            color: 'rgba(90, 59, 65, 1)',
                            fontFamily: 'Heebo, sans-serif',
                            fontWeight: 'bold',
                            padding: '0.5% 15%',
                            fontSize: '1.4rem',
                            display: 'inline-block',
                            cursor: 'pointer',
                        }}
                    >
                        ? על מה נשוחח
                    </Typography>
                    <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', fontSize: '1.05rem' }}>
                        <div style={{ marginBottom: '5%', fontWeight: 600 }}>נשמח לעמוד לשירותכם, לייעץ, להמליץ ולתמוך</div>
                        <div style={{
                            width: '80%',
                            height: '3px',
                            backgroundColor: 'rgba(230, 219, 201, 1)',
                            marginBottom: '5%',
                        }}></div>
                        <div style={{ fontWeight: 600 }}>ScrollsSite@gmail.com :מייל</div>
                        <div style={{ fontWeight: 600 }}>טלפון: 052-7672693</div>
                    </div>
                </div>
            </div>
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={() => setOpenAlert(false)}
            >
                <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
