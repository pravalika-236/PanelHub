import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, clearSuccess } from '../../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user, isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'scholar' ? '/scholar' : '/faculty');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#2c3e50'
    }}>
      <div className="card" style={{ width: '400px', maxWidth: '90vw' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
            PanelHub Login
          </h2>
          <p style={{ textAlign: 'center', color: '#666', margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your NITC email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ marginBottom: '10px', color: '#666' }}>
            Don't have an account?
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link to="/register/scholar" className="btn btn-secondary" style={{ flex: 1 }}>
              Register as Scholar
            </Link>
            <Link to="/register/faculty" className="btn btn-secondary" style={{ flex: 1 }}>
              Register as Faculty
            </Link>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>Demo Credentials:</h4>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <p><strong>Scholar:</strong> john@nitc.ac.in / password123</p>
            <p><strong>Faculty:</strong> smith@nitc.ac.in / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
