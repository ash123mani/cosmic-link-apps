import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'cosmic_link_token';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

interface ApiOptions {
  method?: string;
  body?: Record<string, unknown>;
  auth?: boolean;
}

export async function api<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  let data: any;
  try {
    data = await response.json();
  } catch {
    throw { message: `Server returned invalid response (${response.status}). Is the BE running at ${BASE_URL}?` };
  }

  if (!response.ok) {
    throw { message: data.error || 'Something went wrong', statusCode: data.statusCode || response.status };
  }

  return data as T;
}
