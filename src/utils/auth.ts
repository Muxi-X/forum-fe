export const isLoginRoute = (pathname: string) =>
  pathname === '/login' || pathname.startsWith('/login/');

export const getAuthToken = () => localStorage.getItem('token') || '';

export const hasAuthToken = () => Boolean(getAuthToken());

export const getCurrentUserId = () => Number(localStorage.getItem('userId')) || 0;

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};
