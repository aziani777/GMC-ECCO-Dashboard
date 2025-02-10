import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { API_BASE_URL } from './config';  // Import from config
import './App.css';

function App() {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerAwake, setIsServerAwake] = useState(true);

  const handleRegionSelect = (region) => {
    console.log('Region selected:', region);
    setSelectedRegion(region.toLowerCase());
  };

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setIsServerAwake(true);
        return true;
      }
    } catch (error) {
      console.log('Server might be spinning up...');
      setIsServerAwake(false);
      return false;
    }
  };

  console.log('Current selected region:', selectedRegion);

  return (
    <Router>
      <div className="app">
        {!isServerAwake && (
          <div style={{
            padding: '20px',
            margin: '20px',
            backgroundColor: '#fff3e0',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <h3>Server is starting up...</h3>
            <p>This may take up to 1 minute as our free tier server wakes up.</p>
          </div>
        )}
        <Sidebar onRegionSelect={handleRegionSelect} />
        <main className="content">
          <Dashboard selectedRegion={selectedRegion} />
        </main>
      </div>
    </Router>
  );
}

export default App; 