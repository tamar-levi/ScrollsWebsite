import React from 'react';
import backgroundImage from '../assets/Contact.png';
import { Typography } from '@mui/material';

export default function Contact() {
    return (
        <>
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
        `}
            </style>
            <div
                style={{
                    width: '103.2%',
                    height: '90vh',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    fontFamily: 'Heebo, sans-serif',
                }}
            >
                <div
                    style={{
                        width: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        marginLeft: '7%',
                    }}
                >
                    <div style={{ display: 'flex', gap: '10px', width: '65%' }}>
                        <input
                            type="email"
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
                            }}
                        />
                        <input
                            type="text"
                            placeholder="שם"
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

                            }}
                        />
                    </div>
                    <textarea
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
                        }}
                    ></textarea>
                    <button
                        style={{
                            backgroundColor: 'rgba(90, 59, 65, 1)',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '0.8% 30%',
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '10px',
                            outline: 'none',
                        }}
                    >
                        שלח
                    </button>
                </div>
                <div
                    style={{
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
                        marginLeft:  '-5%',
                    }}
                >
                    <Typography
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', fontSize: '1.05rem' }}>
                        <div style={{ marginBottom: '5%', fontWeight: 600 }}>נשמח לעמוד לשירותכם, לייעץ, להמליץ ולתמוך</div>
                        <div
                            style={{
                                width: '80%',
                                height: '3px',
                                backgroundColor: 'rgba(230, 219, 201, 1)',
                                marginBottom: '5%',

                            }}
                        ></div>
                        <div style={{ fontWeight: 600 }}>ScrollsSite@gmail.com :מייל</div>
                        <div style={{ fontWeight: 600 }}>טלפון: 052-7672693</div>
                    </div>
                </div>
            </div>
        </>
    );
}
