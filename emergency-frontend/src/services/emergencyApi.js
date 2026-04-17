const API_BASE_URL = "https://emergency-alert-system-production-a700.up.railway.app/api/emergency";
const ADMIN_BASE_URL = "https://emergency-alert-system-production-a700.up.railway.app/api/admin";

const readErrorMessage = async (response) => {
  let message = `Request failed with status ${response.status}`;

  try {
    const data = await response.json();
    message = data.message || data.error || message;
  } catch (jsonError) {
    const text = await response.text();
    if (text) {
      message = text;
    }
  }

  return message;
};

const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

export const fetchEmergencyRequestsByRole = async (token, role) => {
  const endpoint = role === "USER" ? "/my" : "/all";
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(token)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json();
};

export const createEmergencyRequest = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/create`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
};

export const updateEmergencyStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
};

export const fetchAllUsers = async (token) => {
  const response = await fetch(`${ADMIN_BASE_URL}/users`, {
    headers: getAuthHeaders(token)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json();
};
