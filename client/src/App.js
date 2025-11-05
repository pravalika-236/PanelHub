import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store, { persistor, useClearOnTabClose } from './store/store';
import Login from './components/auth/Login';
import ScholarRegister from './components/auth/ScholarRegister';
import FacultyRegister from './components/auth/FacultyRegister';
import ScholarDashboard from './components/scholar/ScholarDashboard';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import LandingPage from './components/common/LandingPage';
import { PersistGate } from 'redux-persist/integration/react';
import Loader from './components/common/Loader';

const AppRoutes = () => {
  const { loading, isAuthenticated, role } = useSelector(state => state.auth);

  return (
    <Router>
      {loading && <Loader message='Please Wait' />}
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
  useClearOnTabClose();
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppRoutes />
      </PersistGate>
    </Provider>
  );
}

export default App;
