import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Alert } from '@mui/material';

const clearUserData = () => {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('persist:root');
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    products: [],
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },

    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },

    deleteUser: (state) => {
      state.currentUser = null;
      state.products = [];
      state.error = null;
      clearUserData();

    },

    deleteUserProducts: (state) => {
      state.products = [];
    },

    logout: (state) => {
      state.currentUser = null;
      state.products = [];
      state.error = null;
      clearUserData();
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const {
  setUser,
  updateUser,
  deleteUser,
  deleteUserProducts,
  logout,
  setError,
  clearError,
  setLoading
} = userSlice.actions;

export default userSlice.reducer;

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post('https://scrolls-website.onrender.com/usersApi/logout', {}, { withCredentials: true });
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
    dispatch(logout());
  }
};

export const fetchUserData = () => async (dispatch) => {
  try {
    const response = await axios.get('https://scrolls-website.onrender.com/usersApi/getCurrentUser', {
      withCredentials: true,
    });
    dispatch(setUser(response.data));
  } catch (error) {
    if (error.response?.status === 401 && sessionStorage.getItem('user')) {
      <Alert
        severity="error"
        sx={{
          direction: 'rtl',
          '& .MuiAlert-icon': {
            marginRight: '16px',
            marginLeft: '16px'
          }
        }}
      >
        פג תוקף הסשן, התחבר מחדש
      </Alert>
      dispatch(setError('פג תוקף הסשן, התחבר מחדש'));
    } else {
      console.error('Error fetching user data:', error);
      dispatch(setError('לא הצלחנו למצוא את המשתמש'));
    }
  }
};

