import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy API functions
const dummyAPI = {
  searchSlots: async (searchData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already has an active booking
    const hasBooking = Math.random() > 0.7; // 30% chance of having active booking
    
    if (hasBooking) {
      throw new Error('You already have an active booking. Please manage your existing booking first.');
    }

    // Generate sample available slots
    const slots = [];
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
    
    for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
      const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      slots.push({
        id: i + 1,
        time: randomTime,
        available: true
      });
    }

    return { slots, hasActiveBooking: false };
  },

  bookSlot: async (bookingData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Slot booked successfully! Your booking is now pending approval from all panel faculties.',
      booking: {
        id: Date.now(),
        ...bookingData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    };
  },

  getUserBookings: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleBookings = [
      {
        id: 1,
        userId: userId,
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'Pending',
        faculties: [
          { id: 1, name: 'Dr. Smith', email: 'smith@nitc.ac.in', approved: true },
          { id: 2, name: 'Dr. Johnson', email: 'johnson@nitc.ac.in', approved: false },
          { id: 3, name: 'Dr. Brown', email: 'brown@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-10T10:00:00Z'
      },
      {
        id: 2,
        userId: userId,
        date: '2024-01-20',
        time: '2:00 PM',
        status: 'Confirmed',
        faculties: [
          { id: 1, name: 'Dr. Smith', email: 'smith@nitc.ac.in', approved: true },
          { id: 2, name: 'Dr. Johnson', email: 'johnson@nitc.ac.in', approved: true },
          { id: 3, name: 'Dr. Brown', email: 'brown@nitc.ac.in', approved: true }
        ],
        createdAt: '2024-01-12T14:30:00Z'
      }
    ];

    return sampleBookings;
  },

  cancelBooking: async (bookingId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Booking cancelled successfully!'
    };
  }
};

// Async thunks
export const searchAvailableSlots = createAsyncThunk(
  'booking/searchSlots',
  async (searchData, { rejectWithValue }) => {
    try {
      const response = await dummyAPI.searchSlots(searchData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bookPresentationSlot = createAsyncThunk(
  'booking/bookSlot',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await dummyAPI.bookSlot(bookingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await dummyAPI.getUserBookings(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelUserBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await dummyAPI.cancelBooking(bookingId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    availableSlots: [],
    userBookings: [],
    hasActiveBooking: false,
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    clearSlots: (state) => {
      state.availableSlots = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
        // ✅ added manually so BookSlot can directly update slots from backend
    setAvailableSlots: (state, action) => {
      state.availableSlots = action.payload;
      state.loading = false;
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      // Search Slots
      .addCase(searchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload.slots;
        state.hasActiveBooking = action.payload.hasActiveBooking;
        state.error = null;
      })
      .addCase(searchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasActiveBooking = action.payload.includes('active booking');
      })
      // Book Slot
      .addCase(bookPresentationSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookPresentationSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.availableSlots = [];
        state.userBookings.push(action.payload.booking);
        state.error = null;
      })
      .addCase(bookPresentationSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
        state.error = null;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Booking
      .addCase(cancelUserBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelUserBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(cancelUserBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSlots, clearError, clearSuccess, setAvailableSlots } = bookingSlice.actions;
export default bookingSlice.reducer;
