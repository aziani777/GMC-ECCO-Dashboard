import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [selectedRegion, setSelectedRegion] = useState('global');

  const handleRegionSelect = (region) => {
    console.log('Region selected:', region);
    setSelectedRegion(region.toLowerCase());
  };

  console.log('Current selected region:', selectedRegion);

  return (
    <Router>
      <div className="app">
        <Sidebar onRegionSelect={handleRegionSelect} />
        <main className="content">
          <Dashboard selectedRegion={selectedRegion} />
        </main>
      </div>
    </Router>
  );
}

export default App; 