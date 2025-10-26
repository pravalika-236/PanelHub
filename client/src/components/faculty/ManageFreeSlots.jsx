import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFacultyCalendar, updateCalendarSlot, clearError, clearSuccess } from '../../store/slices/facultySlice';
import Loader from '../common/Loader';

const ManageFreeSlots = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { calendar, loading, error, success } = useSelector(state => state.faculty);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchFacultyCalendar(user.id));
  }, [dispatch, user.id]);

  useEffect(() => {
    if (success) {
      alert(success);
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const courseCategories = ['UG', 'PG', 'PhD'];

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const handleSlotClick = (date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedSlot({ date: dateStr, time, data: calendar[dateStr]?.[time] || { UG: false, PG: false, PhD: false } });
    setShowModal(true);
  };

  const handleCategoryToggle = (category) => {
    if (!selectedSlot) return;
    
    const newCategories = {
      ...selectedSlot.data,
      [category]: !selectedSlot.data[category]
    };
    
    dispatch(updateCalendarSlot({
      date: selectedSlot.date,
      time: selectedSlot.time,
      categories: newCategories,
      facultyId: user.id
    }));
    
    setSelectedSlot({
      ...selectedSlot,
      data: newCategories
    });
  };

  const getSlotColor = (date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    const slot = calendar[dateStr]?.[time];
    if (!slot) return '#f8f9fa';
    
    const categories = Object.values(slot).filter(Boolean);
    if (categories.length === 0) return '#f8f9fa';
    if (categories.length === 1) return '#d4edda';
    if (categories.length === 2) return '#fff3cd';
    return '#d1ecf1';
  };

  const getSlotText = (date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    const slot = calendar[dateStr]?.[time];
    if (!slot) return '';
    
    return Object.entries(slot)
      .filter(([_, available]) => available)
      .map(([category, _]) => category)
      .join(', ');
  };

  if (loading) {
    return <Loader message="Loading your calendar..." />;
  }

  const weekDates = getWeekDates();

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Manage Free Slots</h2>
          <p style={{ color: '#666', margin: 0 }}>
            Click on any cell to add or remove free time for different course categories
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', minWidth: '100px' }}>Date</th>
                {timeSlots.map(time => (
                  <th key={time} style={{ padding: '10px', border: '1px solid #ddd', fontSize: '12px' }}>
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDates.map(date => (
                <tr key={date.toISOString()}>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                    fontWeight: 'bold'
                  }}>
                    <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div style={{ fontSize: '12px' }}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  {timeSlots.map(time => (
                    <td 
                      key={time}
                      style={{ 
                        padding: '8px', 
                        border: '1px solid #ddd',
                        backgroundColor: getSlotColor(date, time),
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '10px',
                        minWidth: '60px',
                        height: '50px'
                      }}
                      onClick={() => handleSlotClick(date, time)}
                    >
                      {getSlotText(date, time)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Legend:</h4>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd' }}></div>
              <span style={{ fontSize: '12px' }}>No free time</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#d4edda', border: '1px solid #ddd' }}></div>
              <span style={{ fontSize: '12px' }}>1 category</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#fff3cd', border: '1px solid #ddd' }}></div>
              <span style={{ fontSize: '12px' }}>2 categories</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#d1ecf1', border: '1px solid #ddd' }}></div>
              <span style={{ fontSize: '12px' }}>3 categories</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedSlot && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Manage Free Time</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              <strong>Date:</strong> {new Date(selectedSlot.date).toLocaleDateString()}<br />
              <strong>Time:</strong> {selectedSlot.time}
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '15px' }}>Available for:</h4>
              {courseCategories.map(category => (
                <label key={category} style={{ display: 'block', marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    checked={selectedSlot.data[category]}
                    onChange={() => handleCategoryToggle(category)}
                    style={{ marginRight: '10px' }}
                  />
                  {category} Students
                </label>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFreeSlots;
