import React, { useState } from 'react';
import './HamburgerMenu.css'; // Import the CSS file
import Navbar from './Navbar';
import './Navbar.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={toggleMenu}>
        {!isOpen && 
          <div className='hamburger-icon'>
            <div></div>
            <div></div>
            <div></div>
          </div>
        }
      </div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        {isOpen && 
          <div className='close-icon mb-15' onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        }
        {/* Add your menu items here */}
        <div className=''>
        Hello
        <Navbar />
        </div>
        
    
      </div>
    </div>
  );
};

export default HamburgerMenu;