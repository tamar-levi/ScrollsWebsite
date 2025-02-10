import { createSlice } from '@reduxjs/toolkit';

const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() >= expirationTime) {
        clearUserData();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token parsing error:', error);
      clearUserData();
      return false;
    }
  }
  return false;
};

const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('persist:root');
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
};

let initialUser = null;
try {
  if (checkTokenExpiration()) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      initialUser = JSON.parse(storedUser);
    }
  }
  else {
    clearUserData();
  }
} catch (error) {
  console.error('Error initializing user data:', error);
  clearUserData();
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: initialUser,
    products: [],
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      if (checkTokenExpiration()) {
        state.currentUser = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        state.currentUser = null;
        state.error = 'פג תוקף החיבור, אנא התחבר/י מחדש';
      }
    },

    updateUser: (state, action) => {
      if (checkTokenExpiration()) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.currentUser));
      } else {
        state.currentUser = null;
        state.error = 'פג תוקף החיבור, אנא התחבר/י מחדש';
      }
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
