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

function AppRoutes() {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to={user.role === 'scholar' ? '/scholar' : '/faculty'} /> : 
            <Login />
          } />
          <Route path="/register/scholar" element={<ScholarRegister />} />
          <Route path="/register/faculty" element={<FacultyRegister />} />
          <Route path="/scholar" element={
            isAuthenticated && user.role === 'scholar' ? 
            <ScholarDashboard /> : 
            <Navigate to="/login" />
          } />
          <Route path="/faculty" element={
            isAuthenticated && user.role === 'faculty' ? 
            <FacultyDashboard /> : 
            <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
