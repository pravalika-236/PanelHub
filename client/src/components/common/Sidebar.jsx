import React from 'react';
import { useSelector } from 'react-redux';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const { userName, role } = useSelector(state => state.auth);
  const scholarMenuItems = [
    { id: 'book-slot', label: 'Book Slot', icon: '📅', navigation: "/scholar/bookslot" },
    { id: 'manage-booking', label: 'Manage Booking', icon: '📋', navigation: "/scholar/managebooking" }
  ];

  const facultyMenuItems = [
    { id: 'manage-slots', label: 'Manage Free Slots', icon: '⏰', navigation: "/faculty/freeslots" },
    { id: 'confirmed-bookings', label: 'View Confirmed Booking', icon: '✅', navigation: "/faculty/confirmed" },
    { id: 'approved-bookings', label: 'Manage Approved Booking', icon: '📝', navigation: "/faculty/approved" },
    { id: 'unapproved-bookings', label: 'View Unapproved Booking', icon: '⏳', navigation: "/faculty/unapproved" }
  ];

  const menuItems = role === 'Scholar' ? scholarMenuItems : facultyMenuItems;

  return (
    <aside style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      width: '250px',
      minHeight: 'calc(100vh - 110px)',
      padding: '20px 0',
      position: 'fixed',
      left: 0,
      top: '60px'
    }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map(item => (
            <li key={item.id} style={{ marginBottom: '5px' }}>
              <button
                onClick={() => onSectionChange(item.navigation)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  backgroundColor: activeSection === item.id ? '#34495e' : 'transparent',
                  color: 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.backgroundColor = '#34495e';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
