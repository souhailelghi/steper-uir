import React, { useState } from 'react';
import axios from 'axios';
import TimsForReservation from '../Reservation/TimsForReservation'; 


const ReservationForm = () => {
    const [studentId, setStudentId] = useState('');
    const [sportId, setSportId] = useState('');
    const [dayBooking, setDayBooking] = useState(1);
    const [hourStart, setHourStart] = useState('');
    const [hourEnd, setHourEnd] = useState('');
    const [studentIdList, setStudentIdList] = useState('');
    const [token, setToken] = useState('');

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

        // Parse the studentIdList to an array
        const studentIds = studentIdList.split(',').map(id => id.trim());

        const reservationData = {
            studentId,
            sportId,
            // Automatically set reservationDate to now
            reservationDate: new Date().toISOString(),
            dayBooking,
            hourStart,
            hourEnd,
            studentIdList: studentIds,
            dateCreation: new Date().toISOString(), // Automatically set to now
            dateModification: new Date().toISOString(), // Automatically set to now
        };

        try {
            const response = await axios.post('https://localhost:7125/api/Reservations/AddReservations', reservationData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("res : ",response);
            
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
            <div>
                <label>Sport ID:</label>
                <input
                    type="text"
                    value={sportId}
                    onChange={(e) => setSportId(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Day Booking:</label>
                <input
                    type="number"
                    value={dayBooking}
                    onChange={(e) => setDayBooking(Number(e.target.value))}
                    min={0}
                    max={6}
                    required
                />
            </div>
            <TimsForReservation onTimeRangeSelect={handleTimeRangeSelect} /> {/* Include TimsForReservation */}
            <div>
                <label>Student ID List :</label>
                <input
                    type="text"
                    value={studentIdList}
                    onChange={(e) => setStudentIdList(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Authorization Token:</label>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Reservation</button>
        </form>
    );
};

export default ReservationForm;
