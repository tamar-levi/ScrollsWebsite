import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { decode as jwt_decode } from 'jwt-decode';

const clearUserData = () => {
  sessionStorage.removeItem('user');
  localStorage.removeItem('token');
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
      sessionStorage.setItem('user', JSON.stringify(action.payload));
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
      sessionStorage.removeItem('user');
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
  dispatch(logout());
};
export const fetchUserData = () => async (dispatch) => {
  try {
    const user = sessionStorage.getItem('user');
    const token = localStorage.getItem('token');
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      dispatch(setError('פג תוקף הסשן, התחבר מחדש'));
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return;
    }

    const response = await axios.get('https://scrolls-website.onrender.com/usersApi/getCurrentUser', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setUser(response.data));
    sessionStorage.setItem('user', JSON.stringify(response.data));

  } catch (error) {
    if (error.response?.status === 401) {
      dispatch(setError('פג תוקף הסשן, התחבר מחדש'));
    } else {
      console.error('Error fetching user data:', error);
      dispatch(setError('לא הצלחנו למצוא את המשתמש'));
    }
  }
};
