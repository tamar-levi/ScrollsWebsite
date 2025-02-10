import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography, Icon } from '@mui/material';

export default function PaymentForm({ onNext, onBack, productData }) {
 return (
    <>
      {productData?.price > 1000 ? (
        <Box
          sx={[
            {
              position: 'absolute',
              bottom: 20,
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row' },
              alignItems: 'center',
              justifyContent: { xs: 'space-between', sm: 'space-between' },
              gap: 2,
              pb: { xs: 12, sm: 0 },
              mt: { xs: 0, sm: 0 },
              width: { xs: '60%', sm: '100%' },
              maxWidth: 600,
              marginLeft: { xs: 'auto', sm: 0 },
              marginRight: { xs: '20px', sm: 0 },
            },
          ]}>
          <Button
            onClick={onBack}
            variant="text"
            sx={{
              display: { xs: 'flex', sm: 'flex' },
              width: { xs: '48%', sm: 'auto' }
            }}
          >
            הקודם
          </Button>
          <Button
            variant="contained"
            // onClick={handlePayment}
            sx={{
              width: { xs: '48%', sm: 'fit-content' }
            }}
          >
            הבא
          </Button>
        </Box>
      ) :
        <Box
          sx={[
            {
              position: 'absolute',
              bottom: 20,
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row' },
              alignItems: 'center',
              justifyContent: { xs: 'space-between', sm: 'space-between' },
              gap: 2,
              pb: { xs: 12, sm: 0 },
              mt: { xs: 0, sm: 0 },
              width: { xs: '0%', sm: '100%' },
              maxWidth: 600,
              marginLeft: { xs: 'auto', sm: 0 },
              marginRight: { xs: '20px', sm: 0 },
            },
          ]}>
          <Button
            onClick={onBack}
            variant="text"
            sx={{
              display: { xs: 'flex', sm: 'flex' },
              width: { xs: '48%', sm: 'auto' }
            }}
          >
            הקודם
          </Button>
          <Button
            variant="contained"
            onClick={() => onNext()}
            sx={{
              width: { xs: '48%', sm: 'fit-content' }
            }}
          >
            הבא
          </Button>
        </Box>
      }
    </>
  );
}
