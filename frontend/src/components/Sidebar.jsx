import React from 'react';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><button>Global</button></li>
          <li><button>Europe</button></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar; 