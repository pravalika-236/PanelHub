import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: { commonSlots: [] },
  reducers: {
    searchAvailableSlots: (state, action) => {
      state.commonSlots = action.payload;
    },
  },
});

export const { searchAvailableSlots } = bookingSlice.actions;
export default bookingSlice.reducer;   // ✅ add this line
