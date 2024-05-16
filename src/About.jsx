import React from 'react';
import './AboutStyles.css';  // Make sure to create this CSS file

const About = () => {
  return (
    <div className="about-container">
      <div className='about-content'>
        <h2 className='welcometxt'>Welcome to Our Music Platform!</h2>
        <p>We're delighted to have you here. Our website is designed to enhance your music listening experience by providing you with a platform to study lyrics. Now, you can not only listen to your favorite songs but also sing along with the lyrics displayed in real-time.</p>

        <p>Whether you're a casual listener or a passionate music enthusiast, we believe our platform will bring a new dimension to your music experience. Enjoy exploring new songs, revisiting old classics, and expanding your musical horizons.</p>

        <p>Thank you for choosing our platform. Enjoy the music and happy singing!</p>
        <div className="fun-fact">
          <p className='font-bold'>Oh, and it's too late, you got rickrolled...</p>
        </div>
      </div>
    </div>
  );
};

export default About;