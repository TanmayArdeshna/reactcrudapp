import React, { useState } from 'react';
import axios from 'axios';

const FilterRecords = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);

  const handleFilter = async () => {
    try {
      // Make a POST request to the server
      const response = await axios.post('http://localhost:3000/filter-records', {
        from: fromDate,
        to: toDate,
      });

      // Update the state with the filtered records
      setFilteredRecords(response.data.records);
      setError(null);
    } catch (error) {
      // Handle errors and update the state
      setFilteredRecords([]);
      setError(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Filter Records</h2>
      <div>
        <label>From Date:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>
      <div>
        <label>To Date:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
      <button onClick={handleFilter}>Filter Records</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>Filtered Records:</h3>
        <ul>
          {filteredRecords.map((record) => (
            <li key={record.id}>{record.name} - {record.date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterRecords;
