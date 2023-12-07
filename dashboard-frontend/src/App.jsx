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

  const chartDataRegion = Object.entries(regionCounts).map(([region, count], index) => [
    region,
    count,
    generateColorPaletteRegion()[index % generateColorPaletteRegion().length],
  ]);
  
  chartDataRegion.unshift(['Region', '', { role: 'style' }]);

  return chartDataRegion;
};



const generateColorPaletteSector = () => [
  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
  '#34495e', '#16a085', '#c0392b', '#d35400', '#8e44ad',
  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
];


const prepareChartDataSector = (data) => {
  const sectorCounts = data.reduce((counts, item) => {
    const sector = item.sector || 'Unknown';

    counts[sector] = (counts[sector] || 0) + 1;
    return counts;
  }, {});

  const chartDataSector = Object.entries(sectorCounts).map(([sector, count], index) => [
    sector,
    count,
    generateColorPaletteSector()[index % generateColorPaletteSector().length],
  ]);

  chartDataSector.unshift(['Sector', 'Count', { role: 'style' }]);

  return chartDataSector;
};


const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState('World');
  const [chartDataRegion, setChartDataRegion] = useState([]);
  const [chartDataSector, setChartDataSector] = useState([]);



  const [selectedOption, setSelectedOption] = useState('region');
  const [highestIntensity, setHighestIntensity] = useState('');
  const [highestLikelihood, setHighestLikelihood] = useState('');
  const [highestRelevance, setHighestRelevance] = useState('');
  

  useEffect(() => {
    if (selectedOption) {
      const { nameIntensity, nameLikelihood, nameRelevance,  averages } = calculateAverages(data, selectedOption);
      setHighestIntensity(
        nameIntensity !== undefined && !isNaN(averages.highestIntensity)
          ? `${nameIntensity} - ${averages.highestIntensity.toFixed(2)}`
          : 'N/A'
      );
      setHighestLikelihood(
        nameLikelihood !== undefined && !isNaN(averages.highestLikelihood)
          ? `${nameLikelihood} - ${averages.highestLikelihood.toFixed(2)}`
          : 'N/A'
      );
      setHighestRelevance(
        nameRelevance !== undefined && !isNaN(averages.highestRelevance)
          ? `${nameRelevance} - ${averages.highestRelevance.toFixed(2)}`
          : 'N/A'
      );
      
    }
  }, [selectedOption, data]);

  const calculateAverages = (data, category) => {
    const categoryValues = data
      .filter((item) => item[category] !== null && item.intensity !== null)
      .reduce((acc, item) => {
        acc[item[category]] = acc[item[category]] || { intensity: 0, likelihood: 0, relevance: 0, count: 0, name: '' };
        acc[item[category]].intensity += parseFloat(item.intensity);
        acc[item[category]].likelihood += parseFloat(item.likelihood);
        acc[item[category]].relevance += parseFloat(item.relevance);
      
        acc[item[category]].count += 1;
        acc[item[category]].name = item[category];
        return acc;
      }, {});
  
    const validDataPoints = Object.keys(categoryValues);
  
    if (validDataPoints.length === 0) {
      console.error(`No valid data points for category: ${category}`);
      return {
        nameIntensity: undefined,
        nameLikelihood: undefined,
        nameRelevance: undefined,
        
        averages: {
          highestIntensity: NaN,
          highestLikelihood: NaN,
          highestRelevance: NaN,
        },
      };
    }
  
    const averages = validDataPoints.map((key) => ({
      category: key,
      intensity: categoryValues[key].intensity / categoryValues[key].count,
      likelihood: categoryValues[key].likelihood / categoryValues[key].count,
      relevance: categoryValues[key].relevance / categoryValues[key].count,
  
    }));
  
    console.log('Averages:', averages);
  
    const highestIntensityItem = averages.reduce((prev, current) =>
      prev.intensity > current.intensity ? prev : current
    );
    const highestLikelihoodItem = averages.reduce((prev, current) =>
      prev.likelihood > current.likelihood ? prev : current
    );
    const highestRelevanceItem = averages.reduce((prev, current) =>
      prev.relevance > current.relevance ? prev : current
    );
   
  
    console.log('Highest Intensity Item:', highestIntensityItem);
  
    // Check if the highest intensity item is not undefined
    const nameIntensity = highestIntensityItem ? highestIntensityItem.category : undefined;
    const nameLikelihood = highestLikelihoodItem ? highestLikelihoodItem.category : undefined;
    const nameRelevance = highestRelevanceItem ? highestRelevanceItem.category : undefined;
    
  
    return {
      nameIntensity,
      nameLikelihood,
      nameRelevance,
      
      averages: {
        highestIntensity: isNaN(highestIntensityItem.intensity) ? NaN : highestIntensityItem.intensity,
        highestLikelihood: isNaN(highestLikelihoodItem.likelihood) ? NaN : highestLikelihoodItem.likelihood,
        highestRelevance: isNaN(highestRelevanceItem.relevance) ? NaN : highestRelevanceItem.relevance
      },
    };
  };

  const options = ['region', 'sector', 'topic'];









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
    const updateChartDataRegion = () => {
      if (selectedContinent === 'World') {
        setChartDataRegion(prepareChartDataRegion(data));
      } else {
        const selectedRegions = regionsForContinent[selectedContinent] || [];
        const filteredData = data.filter(item => {
          const region = item.region || 'Other Regions';
          return selectedRegions.includes(region);
        });
        setChartDataRegion(prepareChartDataRegion(filteredData));
      }
    };

    updateChartDataRegion();
  }, [selectedContinent, data]);

  const handleContinentChange = (event) => {
    const newContinent = event.target.value;
    setSelectedContinent(newContinent);
  };
  
// Region Chart Complete

  useEffect(() => {
      const updateSectorChartData = () => {
        setChartDataSector(prepareChartDataSector(data));
      };

      updateSectorChartData();
    }, [data]);


    









// Inside your component
const generateColorPaletteIntensity = () => [
  '#FFE4B5', '#FFDAB9', '#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493',
];

const [highestIntensitySource, setHighestIntensitySource] = useState(null);
const [chartDataIntensity, setChartDataIntensity] = useState([]);


useEffect(() => {
  // Initialize chart data on component mount
  const { chartDataIntensity, highestIntensitySource } = prepareChartDataIntensity(data);
  setChartDataIntensity(chartDataIntensity);
  setHighestIntensitySource(highestIntensitySource);
}, [data]);


const prepareChartDataIntensity = (data) => {
  const sourceIntensities = {};

  // Calculate total intensity and count for each source
  data.forEach(item => {
    const source = item.source || 'Unknown Source';
    const intensity = parseFloat(item.intensity) || 0;

    if (!sourceIntensities[source]) {
      sourceIntensities[source] = { totalIntensity: 0, count: 0 };
    }

    sourceIntensities[source].totalIntensity += intensity;
    sourceIntensities[source].count += 1;
  });

  // Calculate average intensity for each source
  const averages = Object.keys(sourceIntensities).map(source => {
    const averageIntensity = sourceIntensities[source].totalIntensity / sourceIntensities[source].count;
    return { source, averageIntensity };
  });

  // Sort by average intensity in descending order and select top 6
  const topSources = averages
    .filter(entry => !isNaN(entry.averageIntensity)) // Filter out NaN values
    .sort((a, b) => b.averageIntensity - a.averageIntensity)
    .slice(0, 6);

  // Store the name of the source with the highest average intensity
  const highestIntensitySource = topSources.length > 0 ? topSources[0].source : null;

  // Prepare chart data with the selected sources and colors
  const chartDataIntensity = topSources.map((entry, index) => [
    entry.source,
    entry.averageIntensity,
    generateColorPaletteIntensity()[index % generateColorPaletteIntensity().length],
  ]);

  chartDataIntensity.unshift(['Source', 'Average Intensity', { role: 'style' }]);

  return { chartDataIntensity, highestIntensitySource };
};





return (
<div className="bg-gray-100 font-sans">

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
  
<row>
  <span class="gray-300 p-6 font-bold"> Choose a parameter:</span>
<select
  className="mb-4 px-3 py-2 border border-gray-300  p-2 border border-gray-300 rounded mt-2 transition duration-300 ease-in-out focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
  hover:border-blue-500 hover:ring hover:ring-blue-200 hover:ring-opacity-50" 
  onChange={(e) => setSelectedOption(e.target.value)}
  value={selectedOption}
>
  {options.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ))}
</select>
</row>
<div class="flex flex-wrap pb-5 ">

  <div class="w-full md:w-1/3 pr-3">
    <div class="bg-white rounded-lg border border-gray-300 p-6 ">
      <h2 class="text-xl font-semibold mb-4">Highest Avg. Intensity</h2>
      {/* <!-- Placeholder for the actual chart --> */}
      <div id="chart1" class="border-t mt-4 font-bold pt-4">{highestIntensity}</div>
    </div>
  </div>

  <div class="w-full md:w-1/3 pr-3">
    <div class="bg-white rounded-lg border border-gray-300 p-6">
      <h2 class="text-xl font-semibold mb-4">Highest Avg. Relevance</h2>
      {/* <!-- Placeholder for the actual chart --> */}
      <div id="chart2" class="border-t mt-4 font-bold pt-4">{highestRelevance}</div>
    </div>
  </div>

  <div class="w-full md:w-1/3 ">
    <div class="bg-white rounded-lg border border-gray-300 p-6">
      <h2 class="text-xl font-semibold mb-4">Highest Avg. Likelihood</h2>
      {/* <!-- Placeholder for the actual chart --> */}
      <div id="chart3" class="border-t mt-4 font-bold pt-4">{highestLikelihood}</div>
    </div>
  </div>

</div>




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
                      
                      chartType="PieChart"
                      loader={<div>Loading Chart</div>}
                      data={chartDataRegion}
                      options={{
                        
                        titleTextStyle: { bold: true, color: 'black' },
                        backgroundColor: 'light grey',
                        slices: generateColorPaletteRegion().map(color => ({ color })),
                        
                      }}
                      
                        rootProps={{ 'data-testid': '1' }}
                      />
                    
                </div>




                {/* <!-- Chart 2 --> */}
                <div className="flex-1 mr-4 bg-white p-6 rounded-lg shadow-md">
                    <label  className="text-sm font-semibold">Sector-wise Interactions</label>
                    

                    
                    <Chart
                      
                      chartType="PieChart"
                      loader={<div>Loading Chart</div>}
                      data={chartDataSector}
                      options={{
                        
                        titleTextStyle: { bold: true, color: 'black' },
                        backgroundColor: 'light grey',
                        slices: generateColorPaletteSector().map(color => ({ color })),
                        
                      }}
                      
                        rootProps={{ 'data-testid': '1' }}
                      />
                    
                </div>
            </div>











            {/* <!-- Chart 3 (Second Row - Full Width) --> */}
            <div className="w-full mb-6 opacity-80 transition-opacity duration-500 ease-in-out transform hover:opacity-100">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <label className="text-sm font-semibold">Sources with highest Average Intensity</label>
                    
                    <Chart
                      width="400" height="300"
                      chartType="BarChart"
                      loader={<div>Loading Chart</div>}
                      data={chartDataIntensity}
                      options={{
                        
                        chartArea: {
                          left: 250, // Increase left margin
                          top: 50},
                        titleTextStyle: { bold: true, color: 'black' },
                        backgroundColor: 'light grey',
                        legend: { position: 'none' },
                        bars: 'horizontal',
                        hAxis: {
                          title: 'Average Intensity',
                          minValue: 0,
                          
                        },
                    
                      }}
                      rootProps={{ 'data-testid': '1' }}
                    />
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
