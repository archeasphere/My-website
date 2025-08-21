// User data structure and storage management
export const STORAGE_KEYS = {
  USERS: 'bgs-users-data',
  CURRENT_USER: 'bgs-current-user',
  AUTH: 'bgs-auth-state',
};

export const defaultUser = {
  name: '',
  password: '',
  profilePicture: null,
  isAdmin: false,
  created: null
};

export const loadUserData = () => {
  try {
    const currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    const authState = localStorage.getItem(STORAGE_KEYS.AUTH);
    
    return {
      user: currentUserId ? users[currentUserId] : null,
      isAuthenticated: authState === 'true'
    };
  } catch (error) {
    console.error('Error loading user data:', error);
    return { user: null, isAuthenticated: false };
  }
};

const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const registerUser = async (userData) => {
  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    
    // Check if user already exists
    if (Object.values(users).some(user => user.name === userData.name)) {
      throw new Error('Username already taken');
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(userData.password);
    
    const newUser = {
      ...userData,
      password: hashedPassword,
      isAdmin: false, // New users are never admins
      created: new Date().toISOString()
    };

    users[userId] = newUser;
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    
    return { success: true, user: { ...newUser, password: undefined } };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    const hashedPassword = await hashPassword(credentials.password);
    
    const userId = Object.entries(users).find(([_, user]) => 
      user.name === credentials.name && user.password === hashedPassword
    )?.[0];

    if (!userId) {
      throw new Error('Invalid username or password');
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    
    const user = users[userId];
    return { success: true, user: { ...user, password: undefined } };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const clearUserData = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};
