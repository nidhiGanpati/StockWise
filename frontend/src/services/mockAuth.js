// frontend/src/services/mockAuth.js
// Simple client-side (localStorage) auth used for demos / class submissions.
// NOTE: This is NOT secure and should NOT be used in production.

const USERS_KEY = 'mockUsers';
const TOKEN_KEY = 'token';
const CURRENT_USER_KEY = 'currentUser';

// A relatable default demo account (so the app works immediately)
export const DEMO_ACCOUNT = {
  fullName: 'Nidhi',
  email: 'nidhi@example.com',
  password: 'Nidhi@1234',
  type: 'user',
};

function safeJsonParse(str, fallback) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
}

function loadUsers() {
  return safeJsonParse(localStorage.getItem(USERS_KEY), []);
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function ensureDefaultUser() {
  const users = loadUsers();
  const hasDemo = users.some(
    (u) => (u.email || '').toLowerCase() === DEMO_ACCOUNT.email.toLowerCase()
  );
  if (!hasDemo) {
    users.push({ ...DEMO_ACCOUNT });
    saveUsers(users);
  }
}

export async function registerMock(userData) {
  ensureDefaultUser();
  const users = loadUsers();

  const email = (userData.email || '').trim().toLowerCase();
  if (!email) throw new Error('Email is required.');

  const exists = users.some((u) => (u.email || '').toLowerCase() === email);
  if (exists) throw new Error('An account with this email already exists.');

  const newUser = {
    fullName: userData.fullName || 'New User',
    email,
    password: userData.password || '',
    type: userData.type || 'user',
  };

  users.push(newUser);
  saveUsers(users);

  // mimic backend shape
  return { message: 'User created successfully (mock).' };
}

export async function loginMock(credentials) {
  ensureDefaultUser();
  const users = loadUsers();

  const email = (credentials.email || '').trim().toLowerCase();
  const password = credentials.password || '';

  const matched = users.find((u) => (u.email || '').toLowerCase() === email);
  if (!matched || matched.password !== password) {
    throw new Error('Invalid email or password.');
  }

  // Minimal token + user storage to match existing app logic
  const token = 'mock-token-' + Math.random().toString(36).slice(2);
  localStorage.setItem(TOKEN_KEY, token);

  const user = {
    fullName: matched.fullName,
    email: matched.email,
    type: matched.type || 'user',
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return { user, token, message: 'Login successful (mock).' };
}

export function logoutMock() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUserMock() {
  return safeJsonParse(localStorage.getItem(CURRENT_USER_KEY), null);
}
