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









return (<div className="bg-gray-100 font-sans">

<div className="flex h-screen">

    {/* <!-- Sidebar --> */}
    <aside className="bg-gray-800 text-gray-500 w-64 flex-shrink-0">
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-white">Admin Dashboard</h2>
        </div>
        <nav className="space-y-2 py-4">
            {/* <!-- Add your sidebar navigation links here --> */}
            <a href="#" className="block px-4 py-2 text-sm  rmt-2 transition duration-300 ease-in-out focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                          hover:border-blue-500 hover:ring hover:ring-blue-200 hover:ring-opacity-50">Dashboard</a>
            <a href="#" className="block px-4 py-2 text-sm  rmt-2 transition duration-300 ease-in-out focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                          hover:border-blue-500 hover:ring hover:ring-blue-200 hover:ring-opacity-50">Charts</a>
            {/* <!-- Add more links as needed --> */}
        </nav>
    </aside>

    {/* <!-- Main Content --> */}
    
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">

        <div className="flex flex-wrap justify-between mb-6">

            {/* <!-- Chart 1 and Chart 2 (First Row) --> */}
            <div className="flex w-full mb-6 opacity-80 transition-opacity duration-500 ease-in-out transform hover:opacity-100 ">
                {/* <!-- Chart 1 --> */}
                <div className="flex-1 mr-4 bg-white p-6 rounded-lg shadow-md">
                    <label  className="text-sm font-semibold">Region-wise Interactions</label>
                    <select
                        id="continentDropdown"
                        value={selectedContinent}
                        onChange={handleContinentChange}
                        className="block w-full p-2 border border-gray-300 rounded mt-2 transition duration-300 ease-in-out focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                          hover:border-blue-500 hover:ring hover:ring-blue-200 hover:ring-opacity-50">
                        <option value="World">World</option>
                        <option value="Africa" className="w-1/2">Africa</option>
                        <option value="America">America</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                      </select>

                    
                    <Chart
                      width="400" height="200"
                      chartType="PieChart"
                      loader={<div>Loading Chart</div>}
                      data={chartData}
                      options={{
                        
                        titleTextStyle: { bold: true, color: 'black' },
                        backgroundColor: 'light grey',
                        slices: generateColorPaletteRegion().map(color => ({ color }))
                      }}
                        rootProps={{ 'data-testid': '1' }}
                      />
                    
                </div>

                {/* <!-- Chart 2 --> */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <label className="text-sm font-semibold">Chart 2 Filter:</label>
                    <select id="chart2Filter" className="block w-full p-2 border border-gray-300 rounded mt-2">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                    <canvas id="chart2" width="400" height="200" className="mt-4"></canvas>
                </div>
            </div>

            {/* <!-- Chart 3 (Second Row - Full Width) --> */}
            <div className="w-full mb-6 opacity-80 transition-opacity duration-500 ease-in-out transform hover:opacity-100">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <label className="text-sm font-semibold">Chart 3 Filter:</label>
                    <select id="chart3Filter" className="block w-full p-2 border border-gray-300 rounded mt-2">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                    <canvas id="chart3" width="800" height="200" className="mt-4"></canvas>
                </div>
            </div>

            {/* <!-- Chart 4 and Chart 5 (Third Row) --> */}
            <div className="flex w-full  opacity-80 transition-opacity duration-500 ease-in-out transform hover:opacity-100">
                {/* <!-- Chart 4 --> */}
                <div className="flex-1 mr-4 bg-white p-6 rounded-lg shadow-md">
                    <label  className="text-sm font-semibold">Chart 4 Filter:</label>
                    <select id="chart4Filter" className="block w-full p-2 border border-gray-300 rounded mt-2">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                    <canvas id="chart4" width="400" height="200" className="mt-4"></canvas>
                </div>

                {/* <!-- Chart 5 --> */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <label  className="text-sm font-semibold">Chart 5 Filter:</label>
                    <select id="chart5Filter" className="block w-full p-2 border border-gray-300 rounded mt-2">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                    <canvas id="chart5" width="400" height="200" className="mt-4"></canvas>
                </div>
            </div>

        </div>

    </div>
</div>

  
  </div>
);

};

export default Dashboard;
