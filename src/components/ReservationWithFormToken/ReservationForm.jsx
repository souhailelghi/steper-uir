import React, { useState } from 'react';
import axios from 'axios';
import TimsForReservation from '../ReservationWithFormToken/TimsForReservation';

const ReservationForm = ({ sportId, token }) => {
    const [studentId, setStudentId] = useState('');
    const [dayBooking] = useState(4); // Set dayBooking to 4 and remove setter
    const [hourStart, setHourStart] = useState('');
    const [hourEnd, setHourEnd] = useState('');
    const [studentIdList, setStudentIdList] = useState('');

  const handleTimeRangeSelect = (timeRange) => {
    if (timeRange) {
      setHourStart(timeRange.hourStart);
      setHourEnd(timeRange.hourEnd);
    } else {
      setHourStart('');
      setHourEnd('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentIds = studentIdList.split(',').map((id) => id.trim());

    const reservationData = {
      studentId,
      sportId,
      reservationDate: new Date().toISOString(),
      dayBooking, // Always set to 4
      hourStart,
      hourEnd,
      studentIdList: studentIds,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        'https://localhost:7125/api/Reservations/AddReservations',
        reservationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Reservation created:', response.data);
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Student ID:</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
      </div>
      {/* Removed Day Booking input field since dayBooking is fixed */}
      <TimsForReservation
        sportId={sportId}
        token={token}
        onTimeRangeSelect={handleTimeRangeSelect}
      />
      <div>
        <label>Student ID List :</label>
        <input
          type="text"
          value={studentIdList}
          onChange={(e) => setStudentIdList(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Reservation</button>
    </form>
  );
};

export default ReservationForm;
