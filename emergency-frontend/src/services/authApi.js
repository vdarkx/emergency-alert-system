const AUTH_BASE_URL = "https://emergency-alert-system-production-a700.up.railway.app/api/auth";


const readErrorMessage = async (response) => {
  let message = `Request failed with status ${response.status}`;
  try {
    const data = await response.json();
    message = data.message || data.error || message;
  } catch (error) {
    const text = await response.text();
    if (text) {
      message = text;
    }
  }
  return message;
};

export const registerUser = async (payload) => {
  const response = await fetch(`${AUTH_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
};

export const loginUser = async (payload) => {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
};
