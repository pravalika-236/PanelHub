// src/components/scholar/BookSlot.jsx
import axios from 'axios';
import { useState } from 'react';

function BookSlot() {
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [date, setDate] = useState('');
  const [commonSlots, setCommonSlots] = useState([]);

  const handleCheckSlots = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/slots/common',
        { facultyIds: selectedFaculties, date }
      );
      setCommonSlots(res.data.commonSlots);
    } catch (err) {
      console.error('Error fetching slots', err);
    }
  };

  return (
    <div>
      {/* date & faculty selection UI */}
      <button onClick={handleCheckSlots}>Check available slot</button>
      <ul>
        {commonSlots.map((slot) => (
          <li key={slot}>{slot}</li>
        ))}
      </ul>
    </div>
  );
}

export default BookSlot;
