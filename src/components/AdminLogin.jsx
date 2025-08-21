import React, { useState } from 'react';
import { checkAdminPassword, setAdminMode } from '../utils/adminAuth';
import './AdminLogin.css';

const AdminLogin = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkAdminPassword(password)) {
      setAdminMode(true);
      window.location.reload();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoFocus
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
