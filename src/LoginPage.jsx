import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    setAdminUsername(import.meta.env.VITE_ADMIN_USERNAME);
    setAdminPassword(import.meta.env.VITE_ADMIN_PASSWORD);
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const success = authenticateUser(username, password);
    setIsLoggedIn(success);
  };

  const authenticateUser = (username, password) => {
    return username === adminUsername && password === adminPassword;
  };

  return (
    <div className="login-container">
      {isLoggedIn ? <Redirect to="/" /> : (
        <form onSubmit={handleLogin}>
          <input
            className='usernameinput'
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className='passwordinput'
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className='submitbutton' type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
