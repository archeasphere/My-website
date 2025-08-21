import React, { useState } from 'react';
import { loadUserData, clearUserData } from './authUtils';
import SignInModal from './SignInModal';
import styles from './ProfileButton.module.css';

const ProfileButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { user, isAuthenticated } = loadUserData();

  const handleLogout = () => {
    clearUserData();
    setShowMenu(false);
  };

  return (
    <div className={styles.profileContainer}>
      <button 
        className={styles.profileButton} 
        onClick={() => setShowMenu(!showMenu)}
      >
        {isAuthenticated && user?.profilePicture ? (
          <img src={user.profilePicture} alt={user.name} />
        ) : (
          <div className={styles.profilePlaceholder}>
            {user?.name ? user.name[0].toUpperCase() : '?'}
          </div>
        )}
      </button>

      {showMenu && (
        <div className={styles.profileMenu}>
          {isAuthenticated ? (
            <>
              <div className={styles.profileInfo}>
                <h3>{user.name}</h3>
                {user.isAdmin && <p>Admin</p>}
              </div>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                setShowSignInModal(true);
                setShowMenu(false);
              }}
              className={styles.loginButton}
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {showSignInModal && (
        <SignInModal 
          onClose={() => {
            setShowSignInModal(false);
            setShowMenu(false);
          }}
          onSuccess={() => {
            setShowSignInModal(false);
            setShowMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default ProfileButton;
