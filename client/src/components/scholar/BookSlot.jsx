import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  bookPresentationSlot,
  getFacultyByDepartment,
  getScholarActiveBooking,
  searchAvailableSlots,
  setFilterDateBooking,
} from "../../store/slices/bookingSlice";
import Loader from "../common/Loader";
import Select from "react-select";
import { formatDateToDDMMYYYY, formateTableDate } from "../utils/helperFunctions";
import { useNavigate } from "react-router-dom";

const BookSlot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const booking = useSelector((state) => state.booking)

  const { id, department, courseCategory, userName, email } = auth;
  const { availableSlots, hasActiveBooking, loading, error, success, filterDateBooking, faculties, availableSlotDetails } = booking;

  const [selectedFaculties, setSelectedFaculties] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getFacultyByDepartment(department));
      dispatch(getScholarActiveBooking(id));
    }
  }, [dispatch, id]);

  const handleReload = () => {
    if (id) {
      dispatch(getFacultyByDepartment(department));
      dispatch(getScholarActiveBooking(id));
      setSelectedFaculties([])
    }
  }

  const handleFacultySelect = (selectedOptions) => {
    if (selectedOptions.length <= 3) {
      const selected = selectedOptions.map((opt) =>
        faculties.find(
          (f) => f._id === opt.value || f.id === opt.value
        )
      );
      setSelectedFaculties(selected);
    }
  }

  const handleSearchSlots = () => {
    const facultyIds = selectedFaculties.map(user => user._id);
    dispatch(searchAvailableSlots({ facultyIds: facultyIds, date: formatDateToDDMMYYYY(filterDateBooking), courseCategory: courseCategory }));
  }

  const handleBookSlot = (slot) => {
    const bookingData = {
      scholarId: id,
      scholarName: userName,
      scholarEmail: email,
      facultyIds: availableSlotDetails.facultyIds,
      date: formatDateToDDMMYYYY(filterDateBooking),
      time: slot,
      department: department,
      courseCategory: courseCategory
    }
    dispatch(bookPresentationSlot(bookingData)).then(() => alert("Booking confirmed, view on Manage Booking")).then(() => handleReload())
  }


  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Book Presentation Slot</h2>
          <p style={{ color: "#666", margin: 0 }}>
            Select faculty members and find available slots for your
            presentation
          </p>
        </div>

        {hasActiveBooking && (
          <div className="alert alert-warning">
            <strong>Warning:</strong> You already have an active booking. Please
            manage your existing booking first.
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Select Faculty Members (Max 3)</label>
            <Select
              isMulti
              options={faculties.map((faculty) => ({
                value: faculty._id || faculty.id,
                label: `${faculty.name} (${faculty.email})`,
              }))}
              value={selectedFaculties.map((f) => ({
                value: f._id || f.id,
                label: `${f.name} (${f.email})`,
              }))}
              onChange={(selectedOptions) => handleFacultySelect(selectedOptions)}
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  minHeight: "45px",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#e9ecef",
                }),
              }}
              placeholder="Select up to 3 faculty members"
            />
            <small style={{ color: "#666" }}>
              Selected: {selectedFaculties.length}/3
            </small>
          </div>

          <div style={{ flex: 1 }}>
            <label className="form-label">Preferred Date</label>
            <input
              type="date"
              className="form-control"
              value={filterDateBooking}
              onChange={(e) => dispatch(setFilterDateBooking(e.target.value))}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <button
          onClick={() => handleSearchSlots()}
          className="btn btn-primary"
          disabled={hasActiveBooking || selectedFaculties.length === 0 || selectedFaculties.length === 3}
        >
          {"Search Available Slots"}
        </button>
      </div>

      {loading && <Loader message="Searching for available slots..." />}
      {success && (
        <div className="card">
          <div className="alert alert-success">{success}</div>
        </div>
      )}
      {error && (
        <div className="card">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {availableSlots.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Available Slots</h3>
            <p style={{ color: "#666", margin: 0 }}>
              Select a slot to book your presentation
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            {availableSlots.map((slot) => (
              <div
                key={slot.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h4 style={{ marginBottom: "10px", color: "#333" }}>
                  {formateTableDate(slot)}
                </h4>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  Duration: 1 hour
                </p>
                <button
                  onClick={() => handleBookSlot(slot)}
                  className="btn btn-success"
                  style={{ width: "100%" }}
                  disabled={hasActiveBooking}
                >
                  Book This Slot
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#e9ecef",
              borderRadius: "5px",
            }}
          >
            <h4 style={{ fontSize: "14px", marginBottom: "10px" }}>
              Selected Panel:
            </h4>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {selectedFaculties.map((faculty) => (
                <li key={faculty._id || faculty.id}>{faculty.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {availableSlots.length === 0 && !loading && filterDateBooking && (
        <div className="card">
          <div className="alert alert-warning">
            <strong>No slots available</strong> for the selected date and
            faculty combination. Please try selecting another date or different
            faculty members.
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSlot;