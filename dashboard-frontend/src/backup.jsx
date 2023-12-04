// Your React component

import React, { useState, useEffect } from 'react';

const YourComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      
      const response = await fetch('http://127.0.0.1:8000/api/');
      console.log('got connected');
      
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
      } else {
        const jsonData = await response.json();
        console.log('json data:', jsonData);
      
        setData(jsonData.data);
      }
      
      
    };

    fetchData();
  }, []);

  // Inside the return statement of your React component

return (
  <div>
    <h1>Your Data</h1>
    <ul>
      {data.map(item => (
        <li key={item.id}>
          <strong>ID:</strong> {item.id}, {' '}
          <strong>End Year:</strong> {item.end_year}, {' '}
          <strong>Intensity:</strong> {item.intensity}, {' '}
          {/* Repeat for other fields */}
        </li>
      ))}
    </ul>
  </div>
);

};

export default YourComponent;
