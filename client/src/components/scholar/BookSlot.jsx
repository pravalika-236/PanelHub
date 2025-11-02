import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const BookSlot = () => {
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [date, setDate] = useState("");
  const [commonSlots, setCommonSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fetchingFaculties, setFetchingFaculties] = useState(true);

  // ✅ Fetch faculties dynamically from backend (MongoDB)
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faculty");
        setFaculties(res.data);
      } catch (err) {
        console.error("Error fetching faculties:", err);
        setError("Failed to load faculty list. Please try again later.");
      } finally {
        setFetchingFaculties(false);
      }
    };

    fetchFaculties();
  }, []);

  // ✅ Handle slot check
  const handleCheckSlots = async () => {
    if (!date || selectedFaculties.length === 0) {
      setError("Please select at least one faculty and a date.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);
    setCommonSlots([]);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/faculty/common-slots",
        {
          facultyIds: selectedFaculties.map((f) => f.value),
          date,
        }
      );

      if (res.data.commonSlots && res.data.commonSlots.length > 0) {
        setCommonSlots(res.data.commonSlots);
        setSuccess("Common slots retrieved successfully!");
      } else {
        setError("No common slots found for the selected faculties and date.");
      }
    } catch (err) {
      console.error("Error fetching common slots:", err);
      setError("Error fetching slots. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card shadow-lg"
      style={{ maxWidth: "850px", margin: "2rem auto", padding: "2rem" }}
    >
      <div className="card-header bg-primary text-white rounded">
        <h2 className="card-title mb-0">Book Presentation Slot</h2>
        <p className="mb-0" style={{ color: "#e0e0e0" }}>
          Select faculty members and find available common slots for your
          presentation
        </p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}

      {/* Inputs */}
      <div style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
        <div style={{ flex: 1 }}>
          <label className="form-label fw-semibold">Select Faculty Members</label>

          {fetchingFaculties ? (
            <p>Loading faculties...</p>
          ) : (
            <Select
              isMulti
              options={faculties.map((f) => ({
                value: f._id,
                label: f.name,
              }))}
              value={selectedFaculties}
              onChange={(selected) => setSelectedFaculties(selected || [])}
              placeholder="Select faculty members"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: "8px",
                  borderColor: "#ccc",
                  minHeight: "45px",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#e9ecef",
                }),
              }}
            />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <label className="form-label fw-semibold">Select Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <button
        onClick={handleCheckSlots}
        className="btn btn-primary mt-2"
        disabled={loading || fetchingFaculties}
      >
        {loading ? "Checking..." : "Check Common Slots"}
      </button>

      {/* Slots Display */}
      <div className="card mt-4 border-0 shadow-sm">
        <div className="card-header bg-light">
          <h3 className="card-title mb-0">Available Common Slots</h3>
          <p style={{ color: "#666", margin: 0 }}>
            Common slots where all selected faculties are available
          </p>
        </div>

        <div className="card-body">
          {loading ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Loading slots...
            </p>
          ) : commonSlots.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              {commonSlots.map((slot) => (
                <div
                  key={slot}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <h4 style={{ marginBottom: "10px", color: "#333" }}>{slot}</h4>
                  <p style={{ color: "#666", marginBottom: 0 }}>Duration: 1 hour</p>
                </div>
              ))}
            </div>
          ) : (
            !loading &&
            !error && (
              <div className="alert alert-warning mt-3">
                No common slots yet — please select faculties and date.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
