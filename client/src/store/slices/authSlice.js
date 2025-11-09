import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const registerScholar = createAsyncThunk(
  'auth/registerScholar',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/register/scholar',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerFaculty = createAsyncThunk(
  'auth/registerFaculty',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/register/faculty',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: null,
    userName: null,
    email: null,
    department: null,
    courseCategory: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    success: null,
    authToken: null
  },
  reducers: {
    logout: (state) => {
      state.id = null;
      state.user = null;
      state.isAuthenticated = false;
      state.authToken = null;
      state.userName = null;
      state.email = null;
      state.role = null;
      state.error = null;
      state.success = null;
      localStorage.removeItem('persist:root');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.id = action.payload.user.id;
        state.loading = false;
        state.authToken = action.payload.token;
        state.userName = action.payload.user.name;
        state.email = action.payload.user.email;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data.message;
      })

      // Register Scholar
      .addCase(registerScholar.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerScholar.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.data.message;
      })
      .addCase(registerScholar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data.message;
      })

      // Register Faculty
      .addCase(registerFaculty.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerFaculty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.data.message;
      })
      .addCase(registerFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data.message;
      });
  }
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
