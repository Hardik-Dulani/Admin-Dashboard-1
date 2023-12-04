import React, { useState, useEffect } from 'react';
import './index.css';
import { Chart } from 'react-google-charts';


const Dashboard = () => {
  const [data, setData] = useState([]);

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

  const generateColorPaletteRegion = () => [
    '#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#87CEEB',
    '#FF8C00', '#48D1CC', '#FF4500', '#DDA0DD', '#20B2AA',
    '#FF69B4', '#FFD700', '#BA55D3', '#87CEEB', '#FF6347',
    '#FF8C00', '#48D1CC', '#DDA0DD', '#20B2AA', '#BA55D3',
  ];
  
  
  
  const prepareChartDataRegion = () => {
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
  
  const chartData = prepareChartDataRegion();
  
  return (
    <div>
      <Chart
        width={'100%'}
        height={'300px'}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          title: 'Number of Data Points by Region',
          hAxis: {
            title: 'Region',
            titleTextStyle: { bold: true },
            slantedText: true,
            slantedTextAngle: 45,
            textStyle: { fontSize: 10 },
            ticks: [],
          },
          
          legend: 'none',
          // Remove the 'colors' option
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  );
  
  
};

export default Dashboard;
