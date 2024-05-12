import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import your CSS file

const Navbar = () => {
  
  return (
    <nav className=" w-full flex items-center py-5 fixed top-0 z-20 absolute">
      <ul className="nav-list">
        <li className="nav-item"><Link to ="/">Home</Link></li>
        <li className="nav-item"><Link to="/library">My Library</Link></li>
        <li className="nav-item"><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;