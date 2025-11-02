import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import store from './store/store';
import Login from './components/auth/Login';
import ScholarRegister from './components/auth/ScholarRegister';
import FacultyRegister from './components/auth/FacultyRegister';
import ScholarDashboard from './components/scholar/ScholarDashboard';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import LandingPage from './components/common/LandingPage';

const AppRoutes = () => {
  const { loading, userName, isAuthenticated, role } = useSelector(state => state.auth);

  if (loading) {
    return <div>Loading...</div>; // or a proper spinner
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to={role === 'Scholar' ? '/scholar' : '/faculty'} /> : 
            <Login />
          } />
          <Route path="/register/scholar" element={<ScholarRegister />} />
          <Route path="/register/faculty" element={<FacultyRegister />} />
          <Route path="/scholar" element={
            isAuthenticated && role === 'Scholar' ? 
            <ScholarDashboard /> : 
            <Navigate to="/login" />
          } />
          <Route path="/faculty" element={
            isAuthenticated && role === 'Faculty' ? 
            <FacultyDashboard /> : 
            <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
