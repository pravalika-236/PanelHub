import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerFaculty, clearError, clearSuccess } from '../../store/slices/authSlice';

const FacultyRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });

  useEffect(() => {
    if (success) {
      alert("Account creation Sucess, Please Login")
      navigate('/login');
    }
  }, [success, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const departments = ['CSE', 'ME', 'ECE', 'EEE', 'CE'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerFaculty(formData));
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      backgroundColor: '#2c3e50',
      padding: '20px 0',
      flexDirection: "row"
    }}>
      <img
        src="/logo.png"
        alt="Logo"
        width={350}
        height={250}
        className='bounce'
      />
      <div className="card" style={{ width: '500px', maxWidth: '90vw' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
            Faculty Registration
          </h2>
          <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>
            Create your faculty account
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">NITC Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@nitc.ac.in"
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Must be a valid NITC email address
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ marginBottom: '10px', color: '#666' }}>
            Already have an account?
          </p>
          <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegister;
