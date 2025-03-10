import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Box,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Alert,
} from '@mui/material';

const AddProduct = ({ onNext, onFormSubmit, productData }) => {
    const [formData, setFormData] = useState({
        scriptType: productData ? productData.scriptType : '',
        scrollType: productData ? productData.scrollType : '',
        price: productData ? productData.price : '',
        primaryImage: productData ? productData.primaryImage : null,
        additionalImages: productData ? productData.additionalImages : [],
        note: productData ? productData.note : '',
        isPremiumAd: productData ? productData.isPremiumAd : false,
    });
    const [showAlert, setShowAlert] = useState(false);
    const [imageLimitAlert, setImageLimitAlert] = useState(false);

    const scriptTypes = [
        "בית יוסף",
        "האר''י",
        "ספרדי (וועליש)",
        "חב''ד",
        "תימני",
        "אחר"
    ];
    const scrollTypes = [
        "המלך 28 שורות",
        "המלך 21 שורות",
        "11 שורות",
        "42 שורות",
        "11 שורות גליון ס''ת",
        "אחר"
    ];
    const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: false,
    };

    const compressImage = async (imageFile) => {
        return await imageCompression(imageFile, compressionOptions);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' || type === 'radio' ? checked : value,
        }));
    };

    const handlePrimaryImageChange = async (e) => {
        if (e.target.files[0]) {
            const compressedImage = await compressImage(e.target.files[0]);
            setFormData(prev => ({
                ...prev,
                primaryImage: compressedImage,
            }));
        }
    };

    const handleAdditionalImagesChange = async (e) => {
        const files = Array.from(e.target.files);
        if (formData.additionalImages.length + files.length > 4) {
            setImageLimitAlert(true);
            return;
        }
        const compressedImages = await Promise.all(files.map(file => compressImage(file)));
        setFormData(prev => ({
            ...prev,
            additionalImages: [...prev.additionalImages, ...compressedImages],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.primaryImage || !formData.scriptType || !formData.scrollType) {
            setShowAlert(true);
            return;
        }
        onNext();
        onFormSubmit(formData);
    };

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
            <Box sx={{
                padding: { xs: 2, md: 0 },
                marginTop: { xs: 2, md: 4 },
                direction: 'rtl',
                fontFamily: 'Heebo, sans-serif',
                margin: '0 auto',
                '@media (max-width: 960px)': {
                    transform: 'scale(0.95)',
                }
            }}>
                {showAlert && (
                    <Alert severity="error" sx={{ marginBottom: 2, '& .MuiAlert-icon': { marginLeft: 2 } }}>
                        יש למלא את כל פרטי המוצר
                    </Alert>
                )}

                <Grid container spacing={{ xs: 2, md: 3 }} sx={{
                    justifyContent: 'space-around',
                    '& .MuiGrid-item': {
                        width: { xs: '100%', md: '48%' },
                        maxWidth: { xs: '100%', md: '48%' }
                    }
                }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                name="scriptType"
                                value={formData.scriptType}
                                onChange={handleChange}
                                required
                                sx={{
                                    fontFamily: 'Heebo, sans-serif',
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    height: '35px',
                                    borderRadius: '25px',
                                    backgroundColor: 'rgba(90, 59, 65, 1)',
                                    color: 'white',
                                    border: 'none',
                                    width: '110%',
                                    '& .MuiSelect-icon': { color: 'white' },
                                    '& .MuiSelect-select': { paddingLeft: '10px' },
                                    '&:focus': { borderColor: 'none' },
                                }}
                            >
                                <MenuItem value="" disabled>סוג כתב</MenuItem>
                                {scriptTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                name="scrollType"
                                value={formData.scrollType}
                                onChange={handleChange}
                                required
                                sx={{
                                    fontFamily: 'Heebo, sans-serif',
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    height: '35px',
                                    borderRadius: '25px',
                                    backgroundColor: 'rgba(90, 59, 65, 1)',
                                    color: 'white',
                                    border: 'none',
                                    width: '110%',
                                    '& .MuiSelect-icon': { color: 'white' },
                                    '& .MuiSelect-select': { paddingLeft: '10px' },
                                    '&:focus': { borderColor: 'none' },
                                }}
                            >
                                <MenuItem value="" disabled>סוג המגילה</MenuItem>
                                {scrollTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="מחיר"
                            min="100"
                            style={{
                                fontFamily: 'Heebo, sans-serif',
                                fontSize: '1rem',
                                height: '35px',
                                backgroundColor: 'rgba(90, 59, 65, 1)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                paddingLeft: '10px',
                                width: '110%',
                                boxSizing: 'border-box',
                                textIndent: '10px'
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="הערות"
                            rows={1}
                            style={{
                                fontFamily: 'Heebo, sans-serif',
                                fontSize: '1rem',
                                height: '35px',
                                backgroundColor: 'rgba(90, 59, 65, 1)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '8px 10px',
                                width: '110%',
                                boxSizing: 'border-box',
                                resize: 'none',
                                overflow: 'hidden',
                                lineHeight: '1.2',
                            }}
                        />
                    </Grid>

                    <Grid container sx={{
                        marginTop: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <Grid item xs={12} sm={5} sx={{ marginTop: 2 }}>
                            <label htmlFor="primary-image-upload">
                                <input
                                    id="primary-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePrimaryImageChange}
                                    required
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderColor: 'rgba(90, 59, 65, 1)',
                                        color: 'white',
                                        border: 1,
                                        borderRadius: '25px',
                                        backgroundColor: 'rgba(90, 59, 65, 1)',
                                        margin: 0,
                                        fontFamily: 'Heebo, sans-serif',
                                        fontSize: { xs: '0.9rem', sm: '0.9rem' },
                                        padding: '6px 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        fontWeight: 300
                                    }}
                                    startIcon={<CloudUploadIcon />}
                                    component="span"
                                >
                                    העלאת תמונה ראשית
                                </Button>
                            </label>
                        </Grid>

                        <Grid item xs={12} sm={5} sx={{ marginTop: 2 }}>
                            <label htmlFor="additional-images-upload">
                                <input
                                    id="additional-images-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAdditionalImagesChange}
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderColor: 'rgba(90, 59, 65, 1)',
                                        color: 'white',
                                        border: 1,
                                        borderRadius: '25px',
                                        backgroundColor: 'rgba(90, 59, 65, 1)',
                                        margin: 0,
                                        fontFamily: 'Heebo, sans-serif',
                                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                        padding: '6px 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        fontWeight: 300
                                    }}
                                    startIcon={<CloudUploadIcon />}
                                    component="span"
                                >
                                    העלאת תמונות נוספות
                                </Button>
                            </label>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontFamily: 'Heebo, sans-serif',
                        color: 'rgba(63, 65, 78, 1)',
                        fontWeight: 300
                    }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isPremiumAd"
                                    checked={formData.isPremiumAd}
                                    onChange={handleChange}
                                    size="small"
                                />
                            }
                            label="מודעת פרימיום"
                            sx={{
                                fontSize: '0.9rem',
                                margin: '0',
                                marginTop: '5px',
                            }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                    marginTop: { xs: 2, md: 3 }
                }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: 'rgba(63, 65, 78, 1)',
                            borderRadius: '25px',
                            color: 'white',
                            padding: { xs: '1px 8%', md: '1px 10%' },
                            fontFamily: 'Heebo, sans-serif',
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            fontWeight: 300,
                            '&:hover': {
                                backgroundColor: 'rgba(63, 65, 78, 1)',
                            },
                        }}
                    >
                        המשך
                    </Button>
                </Box>
            </Box>

            {imageLimitAlert && (
                <Alert
                    severity="error"
                    sx={{ marginBottom: 2 }}
                    onClose={() => setImageLimitAlert(false)}
                >
                    לא ניתן להעלות יותר מ-4 תמונות
                </Alert>
            )}
        </>
    );
};

export default AddProduct;
