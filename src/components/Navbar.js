import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
      <Link to="/scoreboard" style={{ color: '#fff', textDecoration: 'none' }}>Scoreboard</Link>
    </nav>
  );
}


export default Navbar;
