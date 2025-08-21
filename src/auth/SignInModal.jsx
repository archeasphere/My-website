import React, { useState } from 'react';
import { loginUser, registerUser } from './authUtils';
import styles from './SignInModal.module.css';

const SignInModal = ({ onClose, onSuccess = onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    profilePicture: null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const authFunction = isRegistering ? registerUser : loginUser;
      const result = await authFunction(formData);
      
      if (result.success) {
        onSuccess();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                name: e.target.value 
              }))}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                password: e.target.value 
              }))}
              required
              placeholder="Enter your password"
            />
          </div>

          {isRegistering && (
            <div className={styles.formGroup}>
              <label>Profile Picture</label>
              <div className={styles.uploadContainer}>
                {formData.profilePicture ? (
                  <div className={styles.imagePreview}>
                    <img src={formData.profilePicture} alt="Preview" />
                    <button 
                      type="button" 
                      className={styles.changeImage}
                      onClick={() => setFormData(prev => ({ ...prev, profilePicture: null }))}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadPrompt}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={styles.fileInput}
                      id="profile-upload"
                    />
                    <label htmlFor="profile-upload">
                      <div className={styles.uploadIcon}>+</div>
                      <span>Choose a profile picture</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>

          <div className={styles.switchMode}>
            <button 
              type="button" 
              className={styles.switchButton}
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Create one'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;
