// src/components/scholar/BookSlot.jsx
import React, { useState } from 'react';
import axios from 'axios';

function BookSlot() {
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [date, setDate] = useState('');
  const [commonSlots, setCommonSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulated faculty list (can later be fetched from backend)
  const faculties = [
    { _id: '68ff46653ebdec0b8a1f06a7', name: 'Dr. Alice Sharma' },
    { _id: '68ff46753ebdec0b8a1f06a9', name: 'Dr. Bob Menon' },
  ];

  const handleFacultySelect = (facultyId) => {
    setSelectedFaculties((prev) =>
      prev.includes(facultyId)
        ? prev.filter((id) => id !== facultyId)
        : [...prev, facultyId]
    );
  };

  const handleCheckSlots = async () => {
    if (!date || selectedFaculties.length === 0) {
      setError('Please select at least one faculty and a date.');
      return;
    }
    setError('');
    setLoading(true);
    setCommonSlots([]);

    try {
      const res = await axios.post('http://localhost:5000/api/faculty/common-slots', {
        facultyIds: selectedFaculties,
        date,
      });

      setCommonSlots(res.data.commonSlots || []);
    } catch (err) {
      console.error('Error fetching slots', err);
      setError('Error fetching slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Book a Slot</h2>

      {/* Date Picker */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="date">Select Date: </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>

      {/* Faculty Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <h4>Select Faculties:</h4>
        {faculties.map((faculty) => (
          <div key={faculty._id}>
            <label>
              <input
                type="checkbox"
                checked={selectedFaculties.includes(faculty._id)}
                onChange={() => handleFacultySelect(faculty._id)}
              />
              {faculty.name}
            </label>
          </div>
        ))}
      </div>

      {/* Check Button */}
      <button
        onClick={handleCheckSlots}
        disabled={loading}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Checking...' : 'Check Available Slot'}
      </button>

      {/* Error Display */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {/* Results */}
      <div style={{ marginTop: '2rem' }}>
        <h4>Common Free Slots:</h4>
        {commonSlots.length > 0 ? (
          <ul>
            {commonSlots.map((slot) => (
              <li key={slot}>{slot}</li>
            ))}
          </ul>
        ) : (
          !loading && <p>No common slots found.</p>
        )}
      </div>
    </div>
  );
}

export default BookSlot;
