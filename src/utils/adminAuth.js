// Import password from environment file
import.meta.env = import.meta.env || {};
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'BattleGrounds2025!@#';

export const checkAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};

export const isAdmin = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

export const setAdminMode = (value) => {
  if (value) {
    localStorage.setItem('isAdmin', 'true');
  } else {
    localStorage.removeItem('isAdmin');
  }
};
