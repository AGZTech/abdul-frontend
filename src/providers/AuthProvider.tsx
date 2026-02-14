'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { authCheckFinished, loginSuccess } from '@/store/slices/authSlice';

export default function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/global/me`;
        const response = await axios.get(apiUrl, { withCredentials: true });
        console.log(response);

        if (response.data && response.data.success !== false) {
          // The API returns { success: true, data: { ...user, token: ... } }
          const userData = response.data.data;

          // Self-healing: Ensure cookie is synced if token is returned
          if (userData?.token) {
            document.cookie = `token=${userData.token}; path=/; max-age=86400; SameSite=Lax`;
          }

          dispatch(loginSuccess({ user: userData }));
        } else {
          // API returned 200 but with success: false (e.g. "Not authenticated")
          throw new Error(response.data?.message || 'Authentication failed');
        }
      } catch (error) {
        console.log('No active session found.');

        // CRITICAL FIX: Clear the token cookie if session is invalid.
        // This prevents the middleware from redirecting back to dashboard, breaking the infinite loop.
        document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';

      } finally {
        dispatch(authCheckFinished());
      }
    };

    checkUserSession();
  }, [dispatch]);

  return <>{children}</>;
}
