import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFacultyBookingsUnapproved, approveBookingRequest, rejectBookingRequest, clearError, clearSuccess, setDateFilter, setTimeFilter, setCourseFilter, cancelFacultyBookingRequest } from '../../store/slices/facultySlice';
import Loader from '../common/Loader';
import { getFacultyByDepartment } from '../../store/slices/bookingSlice';
import { formatDateToDDMMYYYY, formateTableDate, getFacultyEmailMapping, getFacultyNameMapping } from '../utils/helperFunctions';

const ViewUnapprovedBookings = () => {
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.auth);
  const { unapprovedBookings, loading, success, filterDate, filterTime, filterCourse } = useSelector(state => state.faculty);
  const { department } = useSelector(state => state.auth);
  const { faculties } = useSelector(state => state.booking)

  useEffect(() => {
    dispatch(fetchFacultyBookingsUnapproved(
      {
        id: id,
        date: formatDateToDDMMYYYY(filterDate),
        time: filterTime,
        courseCategory: filterCourse
      }
    ));
    dispatch(getFacultyByDepartment(department))
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      alert(success);
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const handleApplyClick = () => {
    dispatch(fetchFacultyBookingsUnapproved(
      {
        id: id,
        date: formatDateToDDMMYYYY(filterDate),
        time: filterTime,
        courseCategory: filterCourse
      }
    ));
  }

  const handleApproveBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to approve this booking request?')) {
      dispatch(approveBookingRequest({ id: bookingId, facultyId: id }));
    }
  };

  const handleRejectBooking = async (bookingId, date, time, facultyIds, cancelFacultyId) => {
    if (window.confirm('Are you sure you want to reject this booking request? This will cancel the booking for all participants.')) {
      dispatch(cancelFacultyBookingRequest(
        {
          id: bookingId,
          date: date,
          time: time,
          facultyIds: facultyIds.map(faculty => faculty.facultyId),
          cancelFacultyId: cancelFacultyId
        }
      ));
    }
  };

  return (
    <div>
      {loading && <Loader message='Please Wait' />}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">View Unapproved Bookings</h2>
          <p style={{ color: '#666', margin: 0 }}>
            Review and approve/reject presentation booking requests where you are a panel member
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px'
        }}>
          <div>
            <label className="form-label">Filter by Date (MM-DD-YYYY)</label>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={(e) => dispatch(setDateFilter(e.target.value))}
            />
          </div>
          <div>
            <label className="form-label">Filter by Time</label>
            <select
              className="form-control"
              value={filterTime}
              onChange={(e) => dispatch(setTimeFilter(e.target.value))}
            >
              <option value="">All Times</option>
              <option value="08-09">8:00 AM</option>
              <option value="09-10">9:00 AM</option>
              <option value="10-11">10:00 AM</option>
              <option value="11-12">11:00 AM</option>
              <option value="12-13">12:00 PM</option>
              <option value="13-14">1:00 PM</option>
              <option value="14-15">2:00 PM</option>
              <option value="15-16">3:00 PM</option>
              <option value="16-17">4:00 PM</option>
              <option value="17-18">5:00 PM</option>
              <option value="18-19">6:00 PM</option>
              <option value="19-20">7:00 PM</option>
            </select>
          </div>
          <div>
            <label className="form-label">Filter by Course Category</label>
            <select
              className="form-control"
              value={filterCourse}
              onChange={(e) => dispatch(setCourseFilter(e.target.value))}
            >
              <option value="">All Categories</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              <option value="PHD">PHD</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => handleApplyClick()}>Apply Filters</button>
        </div>

        {unapprovedBookings.length === 0 ? (
          <div className="alert alert-warning">
            <strong>No unapproved bookings found.</strong>
            {unapprovedBookings.length === 0
              ? " You don't have any pending booking requests."
              : " Try adjusting your filters."
            }
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {unapprovedBookings.map(booking => (
              <div key={booking.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ marginBottom: '5px', color: '#333' }}>
                      Presentation Booking Request
                    </h3>
                    <p style={{ margin: 0, color: '#666' }}>
                      <strong>Date:</strong> {booking.date} |
                      <strong> Time:</strong> {formateTableDate(booking.time)} |
                      <strong> Duration:</strong> 1 hour
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      Awaiting Your Approval
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>Scholar Details:</h4>
                  <div style={{ padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                    <p style={{ margin: 0 }}>
                      <strong>Name:</strong> {booking?.scholarName}<br />
                      <strong>Email:</strong> {booking?.scholarEmail}<br />
                      <strong>Course Category:</strong> {booking.courseCategory}<br />
                      <strong>Department:</strong> {booking.department}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>Panel Members Status:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {booking.facultyApprovals.map(faculty => (
                      <div key={faculty.id} style={{
                        padding: '8px 12px',
                        backgroundColor: faculty.approveStatus ? '#d4edda' : '#fff3cd',
                        border: `1px solid ${faculty.approveStatus ? '#c3e6cb' : '#ffeaa7'}`,
                        borderRadius: '5px',
                        fontSize: '12px'
                      }}>
                        <div style={{ fontWeight: 'bold' }}>{getFacultyNameMapping(faculty.facultyId, faculties)}</div>
                        <div style={{ color: '#666' }}>{getFacultyEmailMapping(faculty.facultyId, faculties)}</div>
                        <div style={{
                          color: faculty.approveStatus ? '#155724' : '#856404',
                          fontWeight: 'bold'
                        }}>
                          {faculty.approveStatus ? '✓ Approved' : '⏳ Pending'}
                        </div>
                        {faculty.facultyId === id && (
                          <div style={{ color: '#0c5460', fontWeight: 'bold' }}>You</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#666' }}>
                    Requested: {new Date(booking.createdAt).toLocaleString()}
                  </small>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleRejectBooking(booking._id, booking.date, booking.time, booking.facultyApprovals, id)}
                      className="btn btn-danger"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveBooking(booking._id, id)}
                      className="btn btn-success"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUnapprovedBookings;