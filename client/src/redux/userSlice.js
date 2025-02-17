import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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
    await axios.post('http://localhost:5000/usersApi/logout', {}, { withCredentials: true });
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
    dispatch(logout());
  }
};

export const fetchUserData = () => async (dispatch) => {
  console.log('Sending request...');
  console.log("document.cookie.token", document.cookie.token);
  try {
    const response = await axios.get('http://localhost:5000/usersApi/getCurrentUser', {
      withCredentials: true, 
    });
    dispatch(setUser(response.data));  
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('פג תוקף הסשן, התחבר מחדש');
      dispatch(setError('פג תוקף הסשן, התחבר מחדש')); 
    } else {
      console.error('Error fetching user data:', error);
      dispatch(setError('לא הצלחנו למצוא את המשתמש'));
    }
  }
};

