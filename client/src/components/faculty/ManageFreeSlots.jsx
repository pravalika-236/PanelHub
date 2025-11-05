import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchFacultyCalendar,
  clearSuccess,
  updateFacultySlot
} from '../../store/slices/facultySlice';
import Loader from '../common/Loader';
import {
  formateDateToMMMDD,
  formateDateToWWW,
  formateTableDate,
  getSlotColor,
  getSlotText,
  getWeekDates,
  timeSlots
} from '../utils/helperFunctions';

const ManageFreeSlots = () => {
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const { calendar, loading, success } = useSelector(state => state.faculty);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCalender, setNewCalender] = useState(calendar || {});

  useEffect(() => {
    setNewCalender(calendar || {});
  }, [calendar]);

  useEffect(() => {
    if (id) {
      dispatch(fetchFacultyCalendar(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      alert(success);
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const courseCategories = ['UG', 'PG', 'PHD'];

  const handleSlotClick = (date, time) => {
    setSelectedSlot({
      date,
      time,
      data: { ...(newCalender[date]?.[time] || { UG: false, PG: false, PHD: false }) }
    });
    setShowModal(true);
  };

  const handleCategoryToggle = (category) => {
    setSelectedSlot(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [category]: !prev.data[category]
      }
    }));
  };

  const handleSaveSlot = () => {
    if (!selectedSlot) return;

    const updatedCalender = structuredClone(newCalender);

    if (!updatedCalender[selectedSlot.date]) {
      updatedCalender[selectedSlot.date] = {};
    }
    updatedCalender[selectedSlot.date][selectedSlot.time] = { ...selectedSlot.data };

    setNewCalender(updatedCalender);
    setShowModal(false);
  };

  const handleUpdateCalender = () => {
    dispatch(updateFacultySlot({facultyId: id, calendarData: newCalender}));
  }

  const weekDates = getWeekDates(newCalender);

  return (
    <div>
      {loading && <Loader message='Please Wait' />}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Manage Free Slots</h2>
          <p style={{ color: '#666', margin: 0 }}>
            Click on any cell to add or remove free time for different course categories
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', minWidth: '100px' }}>Date</th>
                {timeSlots.map(time => (
                  <th
                    key={time}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      fontSize: '12px'
                    }}
                  >
                    {formateTableDate(time)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDates.map(date => (
                <tr key={date}>
                  <td
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                      fontWeight: 'bold'
                    }}
                  >
                    <div>{formateDateToMMMDD(date)}</div>
                    <div style={{ fontSize: '12px' }}>{formateDateToWWW(date)}</div>
                  </td>
                  {timeSlots.map(time => (
                    <td
                      key={time}
                      style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        backgroundColor: getSlotColor(date, time, newCalender),
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '10px',
                        minWidth: '60px',
                        height: '50px'
                      }}
                      onClick={() => handleSlotClick(date, time)}
                    >
                      {getSlotText(date, time, newCalender)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px'
          }}
        >
          <button
            className="btn btn-primary"
            style={{ width: '150px' }}
            onClick={handleUpdateCalender}
          >
            Save
          </button>
        </div>

        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e9ecef',
            borderRadius: '5px'
          }}
        >
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

      {/* Modal */}
      {showModal && selectedSlot && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '400px',
              width: '90%'
            }}
          >
            <h3 style={{ marginBottom: '20px' }}>Manage Free Time</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              <strong>Date:</strong> {selectedSlot.date}
              <br />
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
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveSlot} className="btn btn-primary">
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFreeSlots;
