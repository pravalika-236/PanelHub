import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDateToday } from '../../components/utils/helperFunctions';
import axios from 'axios';

export const searchAvailableSlots = createAsyncThunk(
  'booking/searchSlots',
  async (searchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/faculty/common-slots",
        searchData,
      )
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
      const response = await axios.post(
        "http://localhost:5000/api/bookings/book",
        bookingData
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchScholarBookings = createAsyncThunk(
  'booking/fetchScholarBookings',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/scholar/${id}`
      )
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
      const response = null
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFacultyByDepartment = createAsyncThunk(
  'booking/getFacultyByDepartment',
  async (department, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/faculty/faculties/${department}`,
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    availableSlots: [],
    availableSlotDetails: null,
    scholarBookings: [],
    hasActiveBooking: false,
    loading: false,
    error: null,
    success: null,
    filterDateBooking: getDateToday(),
    faculties: []
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
    setFilterDateBooking: (state, action) => {
      state.filterDateBooking = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Search Slots
      .addCase(searchAvailableSlots.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlotDetails = action.payload.data;
        state.availableSlots = action.payload.data.commonSlots
      })
      .addCase(searchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.error = null;
      })
      .addCase(bookPresentationSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch User Bookings
      .addCase(fetchScholarBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchScholarBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.scholarBookings = action.payload.data;
      })
      .addCase(fetchScholarBookings.rejected, (state, action) => {
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

        state.hasActiveBooking = false;
      })
      .addCase(cancelUserBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetching faculty by department
      .addCase(getFacultyByDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFacultyByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFacultyByDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.faculties = action.payload.data;
      })
  }
});

export const { clearSlots, clearError, clearSuccess, setAvailableSlots, setFilterDateBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
