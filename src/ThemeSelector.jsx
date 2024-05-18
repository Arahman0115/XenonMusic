import React, { useEffect } from 'react';

const ThemeSelector = () => {
  useEffect(() => {
    const handleThemeChange = (event) => {
      const selectedTheme = event.target.value;
      document.body.className = selectedTheme;
      localStorage.setItem('selectedTheme', selectedTheme);
      console.log('Theme Changed to:', selectedTheme);
    };

    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
      themeSelector.addEventListener('change', handleThemeChange);
    } else {
      console.log('themeSelector not found');
    }

    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      document.body.className = savedTheme;
      if (themeSelector) {
        themeSelector.value = savedTheme;
      }
    }

    return () => {
      if (themeSelector) {
        themeSelector.removeEventListener('change', handleThemeChange);
      }
    };
  }, []);

  return (
    <select id="themeSelector" className="bg-black-500">
      <option value="theme-default">Default</option>
      <option value="theme-spotify">Spotify</option>
    </select>
  );
};

export default ThemeSelector;