import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { searchAvailableSlots, bookPresentationSlot, clearSlots, clearError, clearSuccess } from '../../store/slices/bookingSlice';
import Loader from '../common/Loader';
import Select from 'react-select';

const BookSlot = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { availableSlots, hasActiveBooking, loading, error, success } = useSelector(state => state.booking);

  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Enhanced faculty data with more names
  const facultyData = [
    { id: 1, name: 'Dr. Smith', email: 'smith@nitc.ac.in', department: 'CSE' },
    { id: 2, name: 'Dr. Johnson', email: 'johnson@nitc.ac.in', department: 'CSE' },
    { id: 3, name: 'Dr. Brown', email: 'brown@nitc.ac.in', department: 'ECE' },
    { id: 4, name: 'Dr. Wilson', email: 'wilson@nitc.ac.in', department: 'ECE' },
    { id: 5, name: 'Dr. Davis', email: 'davis@nitc.ac.in', department: 'ME' },
    { id: 6, name: 'Dr. Miller', email: 'miller@nitc.ac.in', department: 'EEE' },
    { id: 7, name: 'Dr. Taylor', email: 'taylor@nitc.ac.in', department: 'CSE' },
    { id: 8, name: 'Dr. Anderson', email: 'anderson@nitc.ac.in', department: 'ECE' },
    { id: 9, name: 'Dr. White', email: 'white@nitc.ac.in', department: 'ME' },
    { id: 10, name: 'Dr. Black', email: 'black@nitc.ac.in', department: 'EEE' },
    { id: 11, name: 'Dr. Green', email: 'green@nitc.ac.in', department: 'CE' },
    { id: 12, name: 'Dr. Lee', email: 'lee@nitc.ac.in', department: 'CSE' },
    { id: 13, name: 'Dr. Kumar', email: 'kumar@nitc.ac.in', department: 'ECE' },
    { id: 14, name: 'Dr. Patel', email: 'patel@nitc.ac.in', department: 'ME' },
    { id: 15, name: 'Dr. Singh', email: 'singh@nitc.ac.in', department: 'EEE' },
    { id: 16, name: 'Dr. Sharma', email: 'sharma@nitc.ac.in', department: 'CE' },
    { id: 17, name: 'Dr. Gupta', email: 'gupta@nitc.ac.in', department: 'CSE' },
    { id: 18, name: 'Dr. Reddy', email: 'reddy@nitc.ac.in', department: 'ECE' }
  ];

  // Filter faculties by user's department
  const departmentFaculties = facultyData.filter(faculty => faculty.department === user.department);

  const handleFacultyChange = (facultyId) => {
    const faculty = departmentFaculties.find(f => f.id === facultyId);
    if (selectedFaculties.find(f => f.id === facultyId)) {
      setSelectedFaculties(selectedFaculties.filter(f => f.id !== facultyId));
    } else if (selectedFaculties.length < 3) {
      setSelectedFaculties([...selectedFaculties, faculty]);
    } else {
      //   setError('You can select maximum 3 faculties');
    }
  };

  const handleSearchSlots = async () => {
    if (selectedFaculties.length === 0) {
      dispatch(clearError());
      dispatch(clearSuccess());
      return;
    }
    if (!selectedDate) {
      dispatch(clearError());
      dispatch(clearSuccess());
      return;
    }

    dispatch(searchAvailableSlots({
      faculties: selectedFaculties,
      date: selectedDate,
      department: user.department
    }));
  };

  const handleBookSlot = async (slotId) => {
    dispatch(bookPresentationSlot({
      slotId,
      faculties: selectedFaculties,
      date: selectedDate,
      time: availableSlots.find(slot => slot.id === slotId)?.time,
      userId: user.id,
      department: user.department,
      courseCategory: user.courseCategory
    }));
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Book Presentation Slot</h2>
          <p style={{ color: '#666', margin: 0 }}>
            Select faculty members and find available slots for your presentation
          </p>
        </div>

        {hasActiveBooking && (
          <div className="alert alert-warning">
            <strong>Warning:</strong> You already have an active booking. Please manage your existing booking first.
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Select Faculty Members (Max 3)</label>
            <Select
              isMulti
              options={departmentFaculties.map(faculty => ({
                value: faculty.id,
                label: `${faculty.name} (${faculty.email})`,
              }))}
              value={selectedFaculties.map(f => ({
                value: f.id,
                label: `${f.name} (${f.email})`,
              }))}
              onChange={(selectedOptions) => {
                if (selectedOptions.length <= 3) {
                  const selected = selectedOptions.map(opt =>
                    departmentFaculties.find(f => f.id === opt.value)
                  );
                  setSelectedFaculties(selected);
                }
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  minHeight: '45px',
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: '#e9ecef',
                }),
              }}
              placeholder="Select up to 3 faculty members"
            />
            <small style={{ color: '#666' }}>
              Selected: {selectedFaculties.length}/3
            </small>
          </div>

          <div style={{ flex: 1 }}>
            <label className="form-label">Preferred Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <button
          onClick={handleSearchSlots}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Available Slots'}
        </button>
      </div>

      {loading && <Loader message="Searching for available slots..." />}

      {availableSlots.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Available Slots</h3>
            <p style={{ color: '#666', margin: 0 }}>
              Select a slot to book your presentation
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {availableSlots.map(slot => (
              <div key={slot.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9'
              }}>
                <h4 style={{ marginBottom: '10px', color: '#333' }}>{slot.time}</h4>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Duration: 1 hour
                </p>
                <button
                  onClick={() => handleBookSlot(slot.id)}
                  className="btn btn-success"
                  style={{ width: '100%' }}
                >
                  Book This Slot
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Selected Panel:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {selectedFaculties.map(faculty => (
                <li key={faculty.id}>{faculty.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {availableSlots.length === 0 && !loading && selectedDate && (
        <div className="card">
          <div className="alert alert-warning">
            <strong>No slots available</strong> for the selected date and faculty combination.
            Please try selecting another date or different faculty members.
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSlot;
