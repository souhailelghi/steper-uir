import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimsForReservation = ({ onTimeRangeSelect }) => {
  const [sportId, setSportId] = useState('');
  const [day, setDay] = useState('');
  const [token, setToken] = useState('');
  const [timeRanges, setTimeRanges] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set day to today's day
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    setDay(dayOfWeek);
  }, []);

  // Fetch time ranges whenever sportId or day changes
  useEffect(() => {
    if (sportId && day) {
      fetchTimeRanges();
    }
  }, [sportId, day]);

  const fetchTimeRanges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://localhost:7125/api/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${sportId}/${day}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTimeRanges(response.data);
    } catch (err) {
      setError('Error fetching time ranges');
    } finally {
      setLoading(false);
    }
  };

  const handleSportIdChange = (e) => {
    setSportId(e.target.value);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleTimeRangeChange = (e) => {
    const selectedRange = timeRanges.find((tr) => tr.id === e.target.value);
    setSelectedTimeRange(selectedRange);
    onTimeRangeSelect(selectedRange); // Pass selected range back to parent
  };

  return (
    <div>
      <h1>Get Available Time Ranges for {day}</h1>
      <form>
        <div>
          <label htmlFor="sportId">Sport ID:</label>
          <input
            type="text"
            id="sportId"
            value={sportId}
            onChange={handleSportIdChange}
            required
          />
        </div>
        <div>
          <label htmlFor="token">Authorization Token:</label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={handleTokenChange}
            required
          />
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {timeRanges.length > 0 && !loading && (
        <div>
          <h2>Select Available Time Range</h2>
          <form>
            {timeRanges.map((timeRange) => (
              <div key={timeRange.id}>
                <input
                  type="radio"
                  id={`timeRange-${timeRange.id}`}
                  name="timeRange"
                  value={timeRange.id}
                  onChange={handleTimeRangeChange}
                />
                <label htmlFor={`timeRange-${timeRange.id}`}>
                  {timeRange.hourStart} - {timeRange.hourEnd}
                </label>
              </div>
            ))}
          </form>
        </div>
      )}

      {timeRanges.length === 0 && !loading && !error && <p>No time ranges available</p>}
    </div>
  );
};

export default TimsForReservation;
