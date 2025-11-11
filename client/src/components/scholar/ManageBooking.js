import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchScholarBookings, cancelUserBooking, clearSuccess } from '../../store/slices/bookingSlice';
import Loader from '../common/Loader';
import { getFacultyEmailMapping, getFacultyNameMapping } from '../utils/helperFunctions';

const ManageBooking = () => {
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const { scholarBookings, loading, success, faculties } = useSelector(state => state.booking);

  useEffect(() => {
    if (id) {
      dispatch(fetchScholarBookings(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      alert(success);
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelUserBooking(bookingId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#ffc107';
      case 'Confirmed':
        return '#28a745';
      case 'Cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div>
      {loading && <Loader message='Please Wait' />}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Manage Your Bookings</h2>
          <p style={{ color: '#666', margin: 0 }}>
            View and manage your presentation slot bookings
          </p>
        </div>

        {scholarBookings.length === 0 ? (
          <div className="alert alert-warning">
            <strong>No bookings found.</strong> You haven't made any presentation slot bookings yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div key={scholarBookings[0]._id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ marginBottom: '5px', color: '#333' }}>
                      Presentation Slot
                    </h3>
                    <p style={{ margin: 0, color: '#666' }}>
                      <strong>Date:</strong> {new Date(scholarBookings[0].date).toLocaleDateString()} |
                      <strong> Time:</strong> {scholarBookings[0].time}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: getStatusColor(scholarBookings[0].status),
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {scholarBookings[0].status}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>Panel Members:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {scholarBookings[0].facultyApprovals.map(faculty => (
                      <div key={faculty.facultyId} style={{
                        padding: '8px 12px',
                        backgroundColor: faculty.approved ? '#d4edda' : '#fff3cd',
                        border: `1px solid ${faculty.approved ? '#c3e6cb' : '#ffeaa7'}`,
                        borderRadius: '5px',
                        fontSize: '12px'
                      }}>
                        <div style={{ fontWeight: 'bold' }}>{getFacultyNameMapping(faculty.facultyId, faculties)}</div>
                        <div style={{ color: '#666' }}>{getFacultyEmailMapping(faculty.facultyId, faculties)}</div>
                        <div style={{
                          color: faculty.approveStatus ? '#155724' : '#856404',
                          fontWeight: 'bold'
                        }}>
                          {faculty.approveStatus ? 'approved' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#666' }}>
                    Created: {new Date(scholarBookings[0].createdAt).toLocaleString()}
                  </small>
                  <div>
                    {(scholarBookings[0].status === 'pending' || scholarBookings[0].status === 'booked') && (
                      <button
                        onClick={() => handleCancelBooking(scholarBookings[0].id)}
                        className="btn btn-danger"
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Booking Status Guide</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px', border: '1px solid #ffeaa7' }}>
            <h4 style={{ color: '#856404', marginBottom: '5px' }}>Pending</h4>
            <p style={{ fontSize: '12px', color: '#856404', margin: 0 }}>
              Waiting for approval from all panel faculties
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '5px', border: '1px solid #c3e6cb' }}>
            <h4 style={{ color: '#155724', marginBottom: '5px' }}>Confirmed</h4>
            <p style={{ fontSize: '12px', color: '#155724', margin: 0 }}>
              All panel faculties have approved the booking
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '5px', border: '1px solid #f5c6cb' }}>
            <h4 style={{ color: '#721c24', marginBottom: '5px' }}>Cancelled</h4>
            <p style={{ fontSize: '12px', color: '#721c24', margin: 0 }}>
              Booking has been cancelled by you or a faculty member
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBooking;
