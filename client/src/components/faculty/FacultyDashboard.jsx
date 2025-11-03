import React, { useState } from 'react';
import Header from '../common/Header.jsx';
import Footer from '../common/Footer.jsx';
import Sidebar from '../common/Sidebar.jsx';
import ManageFreeSlots from './ManageFreeSlots.jsx';
import ManageApprovedBookings from './ManageApprovedBookings.js';
import ViewConfirmedBookings from './ViewConfirmedBookings.js';
import ViewUnapprovedBookings from './ViewUnapprovedBookings.js';

const FacultyDashboard = () => {
  const [activeSection, setActiveSection] = useState('manage-slots');

  const renderContent = () => {
    switch (activeSection) {
      case 'manage-slots':
        return <ManageFreeSlots />
      case 'confirmed-bookings':
        return <ViewConfirmedBookings />;
      case 'approved-bookings':
        return <ManageApprovedBookings />;
      case 'unapproved-bookings':
        return <ViewUnapprovedBookings />;
      default:
        return <></>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div style={{ display: 'flex', flex: 1, marginTop: '80px', marginBottom: '80px' }}>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main style={{ 
          marginLeft: '250px', 
          padding: '20px', 
          width: 'calc(100% - 250px)',
          minHeight: 'calc(100vh - 160px)'
        }}>
          {renderContent()}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default FacultyDashboard;
