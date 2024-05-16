import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const success = await authenticateUser(username, password);
    setIsLoggedIn(success);
  };

  const authenticateUser = (username, password) => {
    const fakeUsername = '';
    const fakePassword = '';
    return username === fakeUsername && password === fakePassword;
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input className='usernameinput' type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input className='passwordinput' type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className='submitbutton' type="submit">Login</button>
      </form>
      {isLoggedIn && <Redirect to="/" />}
    </div>
  );
};

export default LoginPage;