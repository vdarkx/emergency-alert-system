const AUTH_KEY = "emergency_auth";

export const saveAuth = (authData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

export const loadAuth = () => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};
