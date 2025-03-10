import React, { useState, useEffect } from 'react';
import { Slider, Button, RadioGroup, FormControlLabel, Typography, Radio, Box, Select, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';

const FilterComponent = ({ onFilter, products }) => {
    const maxPrice = products && products.length > 0
        ? Math.max(...products.map(product => product.price))
        : 1000000;
    const [priceRange, setPriceRange] = useState([100, maxPrice]);
    const [fontType, setFontType] = useState('');
    const [scrollType, setScrollType] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSeller, setSelectedSeller] = useState('');
    const [sellers, setSellers] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 900;
            setIsMobile(newIsMobile);
            if (!newIsMobile) {
                setIsFilterOpen(true);
            } else {
                setIsFilterOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const sellerNames = products.reduce((uniqueSellers, product) => {
            const sellerName = product.userId.displayName || product.userId.fullName;
            if (!uniqueSellers.includes(sellerName)) {
                uniqueSellers.push(sellerName);
            }
            return uniqueSellers;
        }, []);
        setSellers(sellerNames);
    }, [products]);

    useEffect(() => {
        const cityNames = products.reduce((uniqueCities, product) => {
            const cityName = product.userId.city;
            if (!uniqueCities.includes(cityName)) {
                uniqueCities.push(cityName);
            }
            return uniqueCities;
        }, []);
        setCities(cityNames);
    }, [products]);

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleFontTypeChange = (event) => {
        setFontType(event.target.value);
    };

    const handleScrollTypeChange = (event) => {
        setScrollType(event.target.value);
    };

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const handleSellerChange = (event) => {
        setSelectedSeller(event.target.value);
    };

    const applyFilters = () => {
        const normalizedFontType = fontType
            .replace(/["']/g, '')
            .replace('הארי', 'האר"י')
            .replace('חבד', 'חב"ד');
        onFilter({
            priceRange,
            fontType: normalizedFontType || null,
            scrollType: scrollType || null,
            city: selectedCity || null,
            seller: selectedSeller || null
        });
        if (isMobile) setIsFilterOpen(false);
    };

    const resetFilters = () => {
        setPriceRange([0, maxPrice]);
        setFontType('');
        setScrollType('');
        setSelectedCity('');
        setSelectedSeller('');
        onFilter({
            priceRange: [0, 100000],
            fontType: null,
            scrollType: null,
            selectedCity: null,
            selectedSeller: null
        });
        if (isMobile) setIsFilterOpen(false);
    };

    const FilterToggleButton = () => (
        isMobile && (
            <Button
                variant="contained"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 999,
                    borderRadius: '50%',
                    minWidth: '50px',
                    height: '50px',
                    backgroundColor: '#5A3B41',
                }}
            >
                <FilterListIcon />
            </Button>
        )
    );

    return (
        <>
            <FilterToggleButton />
            <div
                style={{
                    width: '260px',
                    padding: '20px',
                    borderRadius: '40px 0 0 40px',
                    backgroundColor: '#E6DBC9',
                    boxShadow: '2px 4px 12px rgba(0,0,0,0.15)',
                    position: 'fixed',
                    top: '60px',
                    right: isMobile ? (isFilterOpen ? '0' : '-300px') : '0',
                    height: 'calc(100vh - 100px)',
                    textAlign: 'right',
                    direction: 'rtl',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '16px',
                    zIndex: 1000,
                    transition: 'right 0.3s ease-in-out',
                    fontFamily: 'Heebo, sans-serif',
                    overflow: 'auto',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    scrollbarWidth: 'none',
                    '-ms-overflow-style': 'none'
                }}
            >
                {isMobile && (
                    <Button
                        onClick={() => setIsFilterOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            minWidth: '40px',
                            padding: '8px',
                            color: '#5A3B41',
                            '&:hover': {
                                backgroundColor: 'rgba(90, 59, 65, 0.1)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </Button>
                )}

                <div style={{ width: '70%' }}>
                    <Typography
                        variant="subtitle2"
                        style={{
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            color: '#5A3B41',
                            fontFamily: 'Heebo, sans-serif',
                        }}
                    >
                        בחר סוג כתב:
                    </Typography>
                    <RadioGroup
                        value={fontType}
                        onChange={handleFontTypeChange}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'Heebo, sans-serif',
                            gap: '-10px',
                        }}
                    >
                        {['בית יוסף', 'האר"י', 'ספרדי (וועליש)', 'חב"ד', 'תימני', 'אחר'].map((type) => (
                            <FormControlLabel
                                key={type}
                                value={type}
                                control={
                                    <Radio
                                        size="small"
                                        style={{
                                            padding: '1px',
                                            transform: 'scale(0.5)',
                                        }}
                                    />
                                }
                                label={<span style={{ fontSize: '0.9rem', color: '#5A3B41', fontFamily: 'Heebo, sans-serif' }}>{type}</span>}
                                style={{ margin: 0 }}
                            />
                        ))}
                    </RadioGroup>
                </div>

                <div style={{ width: '70%' }}>
                    <Typography
                        variant="subtitle2"
                        style={{
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            color: '#5A3B41',
                            fontFamily: 'Heebo, sans-serif',
                        }}
                    >
                        בחר סוג מגילה:
                    </Typography>
                    <RadioGroup
                        value={scrollType}
                        onChange={handleScrollTypeChange}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'Heebo, sans-serif',
                            gap: '-10px',
                        }}
                    >
                        {['המלך 28 שורות', 'המלך 21 שורות', '11 שורות', '42 שורות', "11 שורות גליון ס''ת", 'אחר'].map((type) => (
                            <FormControlLabel
                                key={type}
                                value={type}
                                control={
                                    <Radio
                                        size="small"
                                        style={{
                                            padding: '1px',
                                            transform: 'scale(0.5)',
                                        }}
                                    />
                                }
                                label={<span style={{ fontSize: '0.9rem', color: '#5A3B41', fontFamily: 'Heebo, sans-serif' }}>{type}</span>}
                                style={{ margin: 0 }}
                            />
                        ))}
                    </RadioGroup>
                </div>

                <div style={{ width: '70%' }}>
                    <Typography style={{ fontWeight: 'bold', fontSize: '1rem', color: '#5A3B41', fontFamily: 'Heebo, sans-serif', marginBottom: '8px' }}>
                        בחר עיר:
                    </Typography>
                    <Select
                        value={selectedCity}
                        onChange={handleCityChange}
                        fullWidth
                        size="small"
                        displayEmpty
                        sx={{
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '20px',
                            height: '30px',
                            width: '80%',
                            maxWidth: '300px',
                        }}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#5A3B41', fontFamily: 'Heebo, sans-serif' }}>כל הערים</em>
                        </MenuItem>
                        {cities.map((city) => (
                            <MenuItem key={city} value={city} style={{ color: '#5A3B41' }}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </div>

                <div style={{ width: '70%' }}>
                    <Typography style={{ fontWeight: 'bold', fontSize: '1rem', color: '#5A3B41', fontFamily: 'Heebo, sans-serif', marginBottom: '8px' }}>
                        בחר סופר:
                    </Typography>
                    <Select
                        value={selectedSeller}
                        onChange={handleSellerChange}
                        fullWidth
                        size="small"
                        displayEmpty
                        sx={{
                            textAlign: 'right',
                            direction: 'rtl',
                            borderRadius: '20px',
                            height: '30px',
                            width: '80%',
                            maxWidth: '300px',
                        }}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#5A3B41', fontFamily: 'Heebo, sans-serif' }}>כל הסופרים</em>
                        </MenuItem>
                        {sellers.map((seller) => (
                            <MenuItem key={seller} value={seller} style={{ color: '#5A3B41' }}>
                                {seller}
                            </MenuItem>
                        ))}
                    </Select>
                </div>

                <div style={{ width: '70%' }}>
                    <Typography style={{ fontWeight: 'bold', fontSize: '1rem', color: '#5A3B41', fontFamily: 'Heebo, sans-serif' }}>
                        בחר טווח מחירים:
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={100}
                            max={maxPrice}
                            style={{ width: '65%', color: '#5A3B41' }}
                        />
                    </div>
                </div>

                <Box display="flex" justifyContent="center" gap="10px" width="90%" style={{ paddingBottom: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={applyFilters}
                        endIcon={<FilterListIcon />}
                        sx={{
                            flex: 1,
                            gap: '6px',
                            backgroundColor: '#5A3B41',
                            borderRadius: '20px',
                            fontFamily: 'Heebo, sans-serif',
                            height: '30px',
                            minHeight: '30px',
                        }}
                    >
                        סנן
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={resetFilters}
                        endIcon={<RestartAltIcon />}
                        sx={{
                            flex: 1,
                            gap: '6px',
                            borderColor: '#5A3B41',
                            color: '#5A3B41',
                            borderRadius: '20px',
                            fontFamily: 'Heebo, sans-serif',
                            height: '30px',
                            minHeight: '30px',
                        }}
                    >
                        איפוס
                    </Button>
                </Box>
            </div>
        </>
    );
};

export default FilterComponent;
