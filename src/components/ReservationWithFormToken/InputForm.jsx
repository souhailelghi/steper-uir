import React, { useState } from 'react';

const InputForm = ({ onSubmit }) => {
  const [sportId, setSportId] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ sportId, token }); // Pass sportId and token to parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="sportId">Sport ID:</label>
        <input
          type="text"
          id="sportId"
          value={sportId}
          onChange={(e) => setSportId(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="token">Authorization Token:</label>
        <input
          type="text"
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default InputForm;
