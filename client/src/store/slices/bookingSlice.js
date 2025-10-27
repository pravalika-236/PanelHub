const API_BASE = "http://localhost:5000/api";

export const searchAvailableSlots = createAsyncThunk(
  'booking/searchSlots',
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
