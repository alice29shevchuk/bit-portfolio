import type { AuthUser } from '@/store/authSlice';

import { dummyJsonPlain } from './authClient';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export function mapDummyUser(data: Record<string, unknown>): AuthUser {
  return {
    id: Number(data.id),
    username: String(data.username ?? ''),
    email: data.email != null ? String(data.email) : undefined,
    firstName: data.firstName != null ? String(data.firstName) : undefined,
    lastName: data.lastName != null ? String(data.lastName) : undefined,
    gender: data.gender != null ? String(data.gender) : undefined,
    image: data.image != null ? String(data.image) : undefined,
  };
}

export async function loginRequest(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await dummyJsonPlain.post('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  });
  const user = mapDummyUser(data as Record<string, unknown>);
  return {
    accessToken: String((data as { accessToken: string }).accessToken),
    refreshToken: String((data as { refreshToken: string }).refreshToken),
    user,
  };
}

export async function fetchCurrentUser(accessToken: string): Promise<AuthUser> {
  const { data } = await dummyJsonPlain.get('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return mapDummyUser(data as Record<string, unknown>);
}
