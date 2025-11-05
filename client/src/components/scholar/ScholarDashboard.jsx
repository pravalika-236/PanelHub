import React, { useState } from 'react';
import Header from '../common/Header.jsx';
import Footer from '../common/Footer.jsx';
import Sidebar from '../common/Sidebar.jsx';
import BookSlot from './BookSlot.jsx';
import ManageBooking from './ManageBooking.js';

const ScholarDashboard = () => {
  const [activeSection, setActiveSection] = useState('book-slot');

  const renderContent = () => {
    switch (activeSection) {
      case 'book-slot':
        return <BookSlot />
      case 'manage-booking':
        return <ManageBooking />;
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

export default ScholarDashboard;
