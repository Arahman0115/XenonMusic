import React from 'react';
import { useHistory } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const history = useHistory();

  const navigateToLogin = () => {
    history.push('/login');
  };

  const navigateToRegister = () => {
    history.push('/register');
  };

  const navigateToLearnMore = () => {
    history.push('/learn-more');
  };

  return (
    <div className="homepage-container">
      <h2>Welcome to Xenon Music.</h2>
      <div className='button-div'>
        <button className='homepage-button' onClick={navigateToLogin}>Login Here</button>
        <button className='homepage-button' onClick={navigateToRegister}>Register</button>
        <button className='homepage-button' onClick={navigateToLearnMore}>Learn More</button>
      </div>
      <footer className="homepage-footer">
        © 2024 XenonMusic. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;