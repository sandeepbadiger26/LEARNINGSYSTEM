import axios from 'axios';
import { API_BASE_URL } from './config';
import { useAuthStore } from '../store/authStore';

export async function login(email, password) {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  
  const { user, accessToken } = response.data;
  useAuthStore.getState().setAuth(user, accessToken);
  
  return { user, accessToken };
}

export async function register(email, password, name) {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/register`,
    { email, password, name },
    { withCredentials: true }
  );
  
  const { user, accessToken } = response.data;
  useAuthStore.getState().setAuth(user, accessToken);
  
  return { user, accessToken };
}

export async function logout() {
  try {
    await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  } finally {
    useAuthStore.getState().logout();
  }
}

export async function refreshToken() {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/refresh`,
    {},
    { withCredentials: true }
  );
  
  const { user, accessToken } = response.data;
  useAuthStore.getState().setAuth(user, accessToken);
  
  return { user, accessToken };
}
