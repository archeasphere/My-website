import React, { useState } from 'react';
import './wiki.css';
import bgsIcon from '../assets/bgs.png';
import { isAdmin, setAdminMode } from '../utils/adminAuth';
import AdminLogin from '../components/AdminLogin';
import '../components/AdminButton.css';

const WikiNav = ({ articles, onSelect }) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const adminMode = isAdmin();

  const handleLogout = () => {
    setAdminMode(false);
    window.location.reload();
  };

  return (
    <nav className="wiki-nav">
      <div className="nav-content">
        <button className="home-button" onClick={() => onSelect(null)}>
          <img src={bgsIcon} alt="BGS" className="home-icon" />
        </button>
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <button onClick={() => onSelect(article.id)}>{article.title}</button>
            </li>
          ))}
        </ul>
        <div className="admin-controls">
          {adminMode ? (
            <button onClick={handleLogout} className="admin-button">Logout</button>
          ) : (
            <button onClick={() => setShowAdminLogin(true)} className="admin-button">Login</button>
          )}
        </div>
      </div>
      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
    </nav>
  );
};

export default WikiNav;
