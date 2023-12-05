import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';

import { Chart } from 'react-google-charts';

// Move prepareChartDataRegion outside the component
const generateColorPaletteRegion = () => [
  '#FFB6C1', '#FFD700', '#B0C4DE', '#87CEEB', '#98FB98',
  '#FFA07A', '#DDA0DD', '#87CEFA', '#F08080', '#E0FFFF',
  '#C71585', '#00FA9A', '#FF4500', '#6A5ACD', '#FF69B4',
  '#00CED1', '#FFE4B5', '#8A2BE2', '#20B2AA', '#FF6347',
];



const prepareChartDataRegion = (data, selectedContinent = 'World') => {
  const regionCounts = data.reduce((counts, item) => {
    let region = item.region || 'Other Regions';

    if (region === 'Other Regions') {
      region = 'World';
    }

    counts[region] = (counts[region] || 0) + 1;
    return counts;
  }, {});

  delete regionCounts['World'];

  const chartData = Object.entries(regionCounts).map(([region, count], index) => [
    region,
    count,
    generateColorPaletteRegion()[index % generateColorPaletteRegion().length],
  ]);
  
  chartData.unshift(['Region', '', { role: 'style' }]);

  return chartData;
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState('World');
  const [chartData, setChartData] = useState([]);

  const regionsForContinent = {
    Africa: ['Central Africa', 'Northern Africa', 'Southern Africa'],
    America: ['Northern America', 'Central America', 'South America'],
    Asia: ['Southern Asia', 'Central Asia', 'Eastern Asia', 'South-Eastern Asia'],
    Europe: ['Eastern Europe', 'Western Europe', 'Northern Europe', 'Southern Europe'],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateChartData = () => {
      if (selectedContinent === 'World') {
        setChartData(prepareChartDataRegion(data));
      } else {
        const selectedRegions = regionsForContinent[selectedContinent] || [];
        const filteredData = data.filter(item => {
          const region = item.region || 'Other Regions';
          return selectedRegions.includes(region);
        });
        setChartData(prepareChartDataRegion(filteredData));
      }
    };

    updateChartData();
  }, [selectedContinent, data]);

  const handleContinentChange = (event) => {
    const newContinent = event.target.value;
    setSelectedContinent(newContinent);
  };

// Region Chart Complete









return (
  <div className="flex justify-between items-center" style={{backgroundColor: "blue"}}>
    <div className="mr-4">
      <label htmlFor="continentDropdown" className="text-white">Select Continent: </label>
      <select
        id="continentDropdown"
        value={selectedContinent}
        onChange={handleContinentChange}
        className="p-2 border rounded-md bg-gray-800 text-white"
      >
        <option value="World">World</option>
        <option value="Africa">Africa</option>
        <option value="America">America</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
      </select>
    </div>

    <div className="flex-grow">
      <Chart
        width={'90%'}
        height={'500px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          title: 'Number of Data Points by Region',
          titleTextStyle: { bold: true, color: 'black' },
          backgroundColor: 'light grey',
          slices: generateColorPaletteRegion().map(color => ({ color }))
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  </div>
);

};

export default Dashboard;
