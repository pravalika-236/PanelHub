import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy API functions
const dummyAPI = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample users for demo
    const users = [
      { id: 1, name: 'John Doe', email: 'john@nitc.ac.in', password: 'password123', role: 'scholar', department: 'CSE', courseCategory: 'UG' },
      { id: 2, name: 'Dr. Smith', email: 'smith@nitc.ac.in', password: 'password123', role: 'faculty', department: 'CSE' },
      { id: 3, name: 'Jane Wilson', email: 'jane@nitc.ac.in', password: 'password123', role: 'scholar', department: 'ECE', courseCategory: 'PG' },
      { id: 4, name: 'Dr. Brown', email: 'brown@nitc.ac.in', password: 'password123', role: 'faculty', department: 'ECE' },
      { id: 5, name: 'Mike Johnson', email: 'mike@nitc.ac.in', password: 'password123', role: 'scholar', department: 'ME', courseCategory: 'PhD' },
      { id: 6, name: 'Dr. Davis', email: 'davis@nitc.ac.in', password: 'password123', role: 'faculty', department: 'ME' }
    ];

    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      return { success: true, user };
    } else {
      throw new Error('Invalid email or password');
    }
  },

  registerScholar: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate NITC email
    if (!userData.email.endsWith('@nitc.ac.in')) {
      throw new Error('Please enter a valid NITC email address');
    }
    
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    return { success: true, message: 'Account created successfully!' };
  },

  registerFaculty: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate NITC email
    if (!userData.email.endsWith('@nitc.ac.in')) {
      throw new Error('Please enter a valid NITC email address');
    }
    
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    return { success: true, message: 'Account created successfully!' };
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await dummyAPI.login(credentials);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerScholar = createAsyncThunk(
  'auth/registerScholar',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await dummyAPI.registerScholar(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerFaculty = createAsyncThunk(
  'auth/registerFaculty',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await dummyAPI.registerFaculty(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = null;
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
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register Scholar
      .addCase(registerScholar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerScholar.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(registerScholar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register Faculty
      .addCase(registerFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerFaculty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(registerFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
