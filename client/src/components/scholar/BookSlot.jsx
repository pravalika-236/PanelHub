import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  searchAvailableSlots,
  bookPresentationSlot,
  clearError,
  clearSuccess,
  setAvailableSlots, // ✅ added
} from "../../store/slices/bookingSlice";

import Loader from "../common/Loader";
import Select from "react-select";
import axios from "axios";

// ✅ added — helper function to fetch full user profile when department missing
const fetchUserProfile = async (id, token) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch user profile:", err.message);
    return null;
  }
};

const BookSlot = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { availableSlots, hasActiveBooking, loading, error, success } =
    useSelector((state) => state.booking);

  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [userDept, setUserDept] = useState(null);

  useEffect(() => {
    const loadFaculties = async () => {
      console.log("🧠 useEffect triggered. user =", auth);

      const token = auth.authToken || localStorage.getItem("token");
      if (!auth.id || !token) {
        console.warn("⚠️ User or token missing, skipping fetch");
        return;
      }

      let department = auth.department;
      if (!department) {
        console.warn("⚠️ No department in Redux, fetching profile...");
        const profile = await fetchUserProfile(auth.id, token);
        if (profile?.department) {
          department = profile.department;
          setUserDept(profile.department);
          console.log(
            "✅ Department fetched from profile:",
            profile.department
          );
        } else {
          console.warn("❌ Still no department found, skipping fetch");
          return;
        }
      } else {
        setUserDept(department);
      }

      try {
        console.log("📡 Fetching faculties for:", department);
        // 🔧 unified backend route handling: works with either {faculties: [...]} or array
        const res = await axios.get(
          `http://localhost:5000/api/faculty/faculty?department=${department}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedFaculties = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.faculties)
          ? res.data.faculties
          : [];

        setFacultyData(fetchedFaculties);
        console.log("✅ Faculties fetched:", fetchedFaculties);
      } catch (err) {
        console.error("❌ Failed to fetch faculties:", err.message);
      }
    };

    // 🔧 prevent infinite loop — only refetch when auth.id or auth.department changes
    if (auth.id) loadFaculties();
  }, [auth.id, auth.department]); // 🔧 simplified dependency array

  const departmentFaculties = userDept
    ? facultyData.filter((faculty) => faculty.department === userDept)
    : [];

  const handleFacultyChange = (facultyId) => {
    const faculty = departmentFaculties.find(
      (f) => f._id === facultyId || f.id === facultyId
    );
    if (
      selectedFaculties.find((f) => f._id === facultyId || f.id === facultyId)
    ) {
      setSelectedFaculties(
        selectedFaculties.filter(
          (f) => f._id !== facultyId && f.id !== facultyId
        )
      );
    } else if (selectedFaculties.length < 3) {
      setSelectedFaculties([...selectedFaculties, faculty]);
    }
  };

  // REPLACE your current handleSearchSlots with this (minimal change)
  const handleSearchSlots = async () => {
    if (selectedFaculties.length === 0 || !selectedDate) {
      // ✅ simplified combined check
      dispatch(clearError());
      dispatch(clearSuccess());
      return;
    }

    const token = auth.authToken || localStorage.getItem("token");

    try {
      // ✅ added batch (courseCategory) for backend context
      const res = await axios.post(
        "http://localhost:5000/api/faculty/common-slots",
        {
          facultyIds: selectedFaculties.map((f) => f._id || f.id),
          date: selectedDate,
          batch: auth.courseCategory || "UG", // ✅ change: dynamic batch support
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Common slots response:", res.data);

      // ✅ safer access with fallback to empty array
      const transformedSlots =
        res.data?.commonSlots?.flatMap((dayObj) =>
          (dayObj.blocks || []).map((block) => ({
            id: `${dayObj.day}-${block}`,
            time: block,
            day: dayObj.day,
          }))
        ) || [];

      dispatch(clearError());
      dispatch(clearSuccess());

      if (transformedSlots.length > 0) {
        dispatch(setAvailableSlots(transformedSlots)); // ✅ direct update to Redux state
      } else {
        dispatch({
          type: "booking/searchAvailableSlots/rejected",
          error: { message: "No common slots available" },
        });
      }
    } catch (err) {
      console.error("❌ Error fetching common slots:", err);
      dispatch({
        type: "booking/searchAvailableSlots/rejected",
        error: {
          message:
            err.response?.data?.message || "Failed to fetch common slots",
        },
      });
    }
  };

// ---------- REPLACE handleBookSlot WITH THIS (minimal, defensive) ----------
const handleBookSlot = async (slotId) => {
  // ensure we have auth token
  const token = auth.authToken || localStorage.getItem("token");

  // pick out the slot time from currently availableSlots
  const chosen = availableSlots.find((slot) => slot.id === slotId);
  const chosenTime = chosen?.time || null;

  // Build facultyApprovals object — each faculty false initially
  const facultyIds = selectedFaculties.map((f) => f._id || f.id);
  const facultyApprovals = {};
  facultyIds.forEach((fid, idx) => {
    // using keys like faculty1, faculty2 or use the id as key — choose id as key
    facultyApprovals[fid] = false;
  });

  // Defensive defaults: use auth.courseCategory if exists, else "UG"
  const courseCategoryVal = auth.courseCategory || "UG";

  // Make date an ISO date (backend usually likes ISO)
  const isoDate = selectedDate ? new Date(selectedDate).toISOString() : null;

  // Compose booking payload (names chosen to match schema you showed)
  const bookingData = {
    scholarIds: [auth.id],                // array of scholar/user ids
    facultyIds,                           // array of faculty ObjectId strings
    facultyApprovals,                     // map of facultyId => false
    status: "pending",                    // default booking status
    date: isoDate,                        // ISO date string
    time: chosenTime,                     // expects `time` field (string)
    duration: 1,                          // always 1 hour per your spec
    department: userDept || auth.department || "Unknown", // try to send department name
    courseCategory: courseCategoryVal,    // not null
    userId: auth.id,                      // send userId (backend earlier wanted this)
    createdBy: auth.id,                   // include createdBy if backend expects it too
    createdAt: new Date().toISOString(),  // optional metadata
  };

  console.log("📦 Booking data being sent:", bookingData); // debug

  try {
    const res = await axios.post(
      "http://localhost:5000/api/bookings/book",
      bookingData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Booking response:", res.data);
    // TODO: dispatch success into Redux or show toast
  } catch (err) {
    // Show as much useful info as we can (server body or full error)
    console.error("❌ Booking failed:", err.response?.data || err.message);
    // optional: dispatch Redux error, same as you do for other errors
  }
};



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
              options={departmentFaculties.map((faculty) => ({
                value: faculty._id || faculty.id,
                label: `${faculty.name} (${faculty.email})`,
              }))}
              value={selectedFaculties.map((f) => ({
                value: f._id || f.id,
                label: `${f.name} (${f.email})`,
              }))}
              onChange={(selectedOptions) => {
                if (selectedOptions.length <= 3) {
                  const selected = selectedOptions.map((opt) =>
                    departmentFaculties.find(
                      (f) => f._id === opt.value || f.id === opt.value
                    )
                  );
                  setSelectedFaculties(selected);
                }
              }}
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
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <button
          onClick={handleSearchSlots}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Available Slots"}
        </button>
      </div>

      {loading && <Loader message="Searching for available slots..." />}

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
                  {slot.time}
                </h4>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  Duration: 1 hour
                </p>
                <button
                  onClick={() => handleBookSlot(slot.id)}
                  className="btn btn-success"
                  style={{ width: "100%" }}
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

      {availableSlots.length === 0 && !loading && selectedDate && (
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
