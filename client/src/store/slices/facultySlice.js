import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getDateToday } from '../../components/utils/helperFunctions';

// Dummy API functions
const dummyAPI = {
  getFacultyCalendar: async (facultyId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const timeSlots = [
      '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
      '6:00 PM', '7:00 PM', '8:00 PM'
    ];

    const today = new Date();
    const weekData = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      weekData[dateStr] = {};
      timeSlots.forEach(time => {
        weekData[dateStr][time] = {
          UG: Math.random() > 0.7,
          PG: Math.random() > 0.7,
          PhD: Math.random() > 0.7
        };
      });
    }

    return weekData;
  },

  updateFacultySlot: async (slotData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Slot updated successfully!'
    };
  },

  getConfirmedBookings: async (facultyId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sampleBookings = [
      {
        id: 1,
        scholarName: 'John Doe',
        scholarEmail: 'john@nitc.ac.in',
        courseCategory: 'UG',
        department: 'CSE',
        date: '2024-01-15',
        time: '10:00 AM',
        faculties: [
          { id: 1, name: 'Dr. Smith', email: 'smith@nitc.ac.in' },
          { id: 2, name: 'Dr. Johnson', email: 'johnson@nitc.ac.in' },
          { id: 3, name: 'Dr. Brown', email: 'brown@nitc.ac.in' }
        ],
        confirmedAt: '2024-01-12T14:30:00Z'
      },
      {
        id: 2,
        scholarName: 'Jane Wilson',
        scholarEmail: 'jane@nitc.ac.in',
        courseCategory: 'PG',
        department: 'ECE',
        date: '2024-01-18',
        time: '2:00 PM',
        faculties: [
          { id: 4, name: 'Dr. Wilson', email: 'wilson@nitc.ac.in' },
          { id: 5, name: 'Dr. Davis', email: 'davis@nitc.ac.in' },
          { id: 6, name: 'Dr. Miller', email: 'miller@nitc.ac.in' }
        ],
        confirmedAt: '2024-01-14T10:15:00Z'
      },
      {
        id: 3,
        scholarName: 'Mike Johnson',
        scholarEmail: 'mike@nitc.ac.in',
        courseCategory: 'PhD',
        department: 'CSE',
        date: '2024-01-20',
        time: '3:00 PM',
        faculties: [
          { id: 1, name: 'Dr. Smith', email: 'smith@nitc.ac.in' },
          { id: 2, name: 'Dr. Johnson', email: 'johnson@nitc.ac.in' },
          { id: 7, name: 'Dr. Taylor', email: 'taylor@nitc.ac.in' }
        ],
        confirmedAt: '2024-01-16T16:45:00Z'
      }
    ];

    // Filter bookings where current faculty is involved
    return sampleBookings.filter(booking =>
      booking.faculties.some(faculty => faculty.id === facultyId)
    );
  },

  getApprovedBookings: async (facultyId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sampleBookings = [
      {
        id: 1,
        scholarName: 'Alice Brown',
        scholarEmail: 'alice@nitc.ac.in',
        courseCategory: 'UG',
        department: 'CSE',
        date: '2024-01-22',
        time: '10:00 AM',
        faculties: [
          { id: 1, name: 'Dr. Smith', email: 'smith@nitc.ac.in', approved: true },
          { id: 2, name: 'Dr. Johnson', email: 'johnson@nitc.ac.in', approved: false },
          { id: 3, name: 'Dr. Brown', email: 'brown@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-18T10:00:00Z'
      },
      {
        id: 2,
        scholarName: 'Bob Davis',
        scholarEmail: 'bob@nitc.ac.in',
        courseCategory: 'PG',
        department: 'ECE',
        date: '2024-01-25',
        time: '2:00 PM',
        faculties: [
          { id: 4, name: 'Dr. Wilson', email: 'wilson@nitc.ac.in', approved: true },
          { id: 5, name: 'Dr. Davis', email: 'davis@nitc.ac.in', approved: false },
          { id: 6, name: 'Dr. Miller', email: 'miller@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 3,
        scholarName: 'Carol Green',
        scholarEmail: 'carol@nitc.ac.in',
        courseCategory: 'PhD',
        department: 'ME',
        date: '2024-01-27',
        time: '3:00 PM',
        faculties: [
          { id: 7, name: 'Dr. Taylor', email: 'taylor@nitc.ac.in', approved: true },
          { id: 8, name: 'Dr. Anderson', email: 'anderson@nitc.ac.in', approved: false },
          { id: 9, name: 'Dr. White', email: 'white@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-21T16:15:00Z'
      },
      {
        id: 4,
        scholarName: 'David Kumar',
        scholarEmail: 'david@nitc.ac.in',
        courseCategory: 'UG',
        department: 'EEE',
        date: '2024-01-29',
        time: '11:00 AM',
        faculties: [
          { id: 10, name: 'Dr. Black', email: 'black@nitc.ac.in', approved: true },
          { id: 11, name: 'Dr. Green', email: 'green@nitc.ac.in', approved: false },
          { id: 12, name: 'Dr. Lee', email: 'lee@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-23T09:30:00Z'
      }
    ];

    // Filter bookings where current faculty has approved but others haven't
    return sampleBookings.filter(booking =>
      booking.faculties.some(faculty => faculty.id === facultyId && faculty.approved) &&
      booking.faculties.some(faculty => !faculty.approved)
    );
  },

  getUnapprovedBookings: async (facultyId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sampleBookings = [
      {
        id: 1,
        scholarName: 'Charlie Wilson',
        scholarEmail: 'charlie@nitc.ac.in',
        courseCategory: 'UG',
        department: 'CSE',
        date: '2024-01-28',
        time: '10:00 AM',
        faculties: [
          { id: 1, name: 'Dr. Smith', email: 'smith@nitc.ac.in', approved: false },
          { id: 2, name: 'Dr. Johnson', email: 'johnson@nitc.ac.in', approved: false },
          { id: 3, name: 'Dr. Brown', email: 'brown@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-22T09:00:00Z'
      },
      {
        id: 2,
        scholarName: 'Diana Miller',
        scholarEmail: 'diana@nitc.ac.in',
        courseCategory: 'PhD',
        department: 'ECE',
        date: '2024-01-30',
        time: '3:00 PM',
        faculties: [
          { id: 4, name: 'Dr. Wilson', email: 'wilson@nitc.ac.in', approved: false },
          { id: 5, name: 'Dr. Davis', email: 'davis@nitc.ac.in', approved: false },
          { id: 6, name: 'Dr. Miller', email: 'miller@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-24T11:30:00Z'
      },
      {
        id: 3,
        scholarName: 'Eva Taylor',
        scholarEmail: 'eva@nitc.ac.in',
        courseCategory: 'PG',
        department: 'ME',
        date: '2024-02-02',
        time: '2:00 PM',
        faculties: [
          { id: 7, name: 'Dr. Taylor', email: 'taylor@nitc.ac.in', approved: false },
          { id: 8, name: 'Dr. Anderson', email: 'anderson@nitc.ac.in', approved: false },
          { id: 9, name: 'Dr. White', email: 'white@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-26T15:45:00Z'
      },
      {
        id: 4,
        scholarName: 'Frank Patel',
        scholarEmail: 'frank@nitc.ac.in',
        courseCategory: 'UG',
        department: 'EEE',
        date: '2024-02-05',
        time: '4:00 PM',
        faculties: [
          { id: 10, name: 'Dr. Black', email: 'black@nitc.ac.in', approved: false },
          { id: 11, name: 'Dr. Green', email: 'green@nitc.ac.in', approved: false },
          { id: 12, name: 'Dr. Lee', email: 'lee@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-28T13:20:00Z'
      },
      {
        id: 5,
        scholarName: 'Grace Singh',
        scholarEmail: 'grace@nitc.ac.in',
        courseCategory: 'PhD',
        department: 'CE',
        date: '2024-02-08',
        time: '9:00 AM',
        faculties: [
          { id: 13, name: 'Dr. Kumar', email: 'kumar@nitc.ac.in', approved: false },
          { id: 14, name: 'Dr. Patel', email: 'patel@nitc.ac.in', approved: false },
          { id: 15, name: 'Dr. Singh', email: 'singh@nitc.ac.in', approved: false }
        ],
        createdAt: '2024-01-30T10:15:00Z'
      }
    ];

    // Filter bookings where current faculty is involved but hasn't approved yet
    return sampleBookings.filter(booking =>
      booking.faculties.some(faculty => faculty.id === facultyId && !faculty.approved)
    );
  },

  approveBooking: async (bookingId, facultyId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Booking approved successfully!'
    };
  },

  rejectBooking: async (bookingId, facultyId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Booking rejected successfully! All participants have been notified.'
    };
  },

  cancelFacultyBooking: async (bookingId, facultyId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Booking cancelled successfully! All participants have been notified.'
    };
  }
};

// Async thunks
export const createFacultyCalendar = createAsyncThunk(
  'faculty/fetchCalendar',
  async (facultyId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/faculty/${facultyId}`,
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunks
export const fetchFacultyCalendar = createAsyncThunk(
  'faculty/fetchCalendar',
  async (facultyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/faculty/${facultyId}`,
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFacultySlot = createAsyncThunk(
  'faculty/updateSlot',
  async ({ facultyId, calendarData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/faculty/${facultyId}`,
        { freeSlot: calendarData },
        { headers: { 'Content-Type': 'application/json' } }
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveBookingRequest = createAsyncThunk(
  'faculty/approveBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/bookings/faculty/approve",
        bookingData
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectBookingRequest = createAsyncThunk(
  'faculty/rejectBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/bookings/faculty/reject",
        bookingData
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelFacultyBookingRequest = createAsyncThunk(
  'faculty/cancelBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/bookings/faculty/cancel",
        bookingData
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFacultyBookingsUnapproved = createAsyncThunk(
  'faculty/fetchFacultyBookingsUnapproved',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/faculty/${id}`
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchConfirmedBookings = createAsyncThunk(
  'faculty/fetchConfirmedBookings',
  async (facultyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/faculty/confirmed/${facultyId}`
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFacultyApprovedBookings = createAsyncThunk(
  'faculty/fetchApprovedBookings',
  async (facultyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/faculty/approved/${facultyId}`
      )
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const facultySlice = createSlice({
  name: 'faculty',
  initialState: {
    calendar: {},
    confirmedBookings: [],
    approvedBookings: [],
    unapprovedBookings: [],
    filterDate: getDateToday(),
    filterTime: "",
    filterCourse: "",
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    updateCalendarSlot: (state, action) => {
      const { date, time, categories } = action.payload;
      if (!state.calendar[date]) {
        state.calendar[date] = {};
      }
      state.calendar[date][time] = categories;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setDateFilter: (state, action) => {
      state.filterDate = action.payload;
    },
    setTimeFilter: (state, action) => {
      state.filterTime = action.payload
    },
    setCourseFilter: (state, action) => {
      state.filterCourse = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Calendar
      .addCase(fetchFacultyCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacultyCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendar = action.payload.data.freeSlot;
        state.error = null;
      })
      .addCase(fetchFacultyCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Slot
      .addCase(updateFacultySlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFacultySlot.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(updateFacultySlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Confirmed Bookings
      .addCase(fetchConfirmedBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConfirmedBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmedBookings = action.payload.data;
      })
      .addCase(fetchConfirmedBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
      })
      // Fetch Approved Bookings
      .addCase(fetchFacultyApprovedBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacultyApprovedBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedBookings = action.payload.data;
        state.error = null;
      })
      .addCase(fetchFacultyApprovedBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Booking
      .addCase(approveBookingRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveBookingRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(approveBookingRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reject Booking
      .addCase(rejectBookingRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectBookingRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.response.message;
      })
      .addCase(rejectBookingRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Booking
      .addCase(cancelFacultyBookingRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelFacultyBookingRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(cancelFacultyBookingRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //faculty unapproved bookings
      .addCase(fetchFacultyBookingsUnapproved.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchFacultyBookingsUnapproved.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
      })
      .addCase(fetchFacultyBookingsUnapproved.fulfilled, (state, action) => {
        state.loading = false;
        state.unapprovedBookings = action.payload.data;
      })
  }
});

export const { updateCalendarSlot, clearError, clearSuccess, setDateFilter, setTimeFilter, setCourseFilter } = facultySlice.actions;
export default facultySlice.reducer;
