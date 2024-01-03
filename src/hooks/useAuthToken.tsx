import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuthToken = () => {
  const [authToken, setToken] = useState<any | null>(null);

  useEffect(() => {
    const fetchedToken = Cookies.get('authToken');
    if (fetchedToken) {
        setToken(fetchedToken);
    }
  }, []);

  const setAuthToken = (newToken: string) => {
    // Set token logic, this can be storing it in local storage or making an API call
    Cookies.set('authToken', newToken, { secure: false, });
    setToken(newToken);
  };

  const removeAuthToken = () => {
    // Remove token logic, clear it from local storage or revoke it on the server
    Cookies.remove('authToken');
    window.sessionStorage.removeItem('customerCode');
    setToken(null);
  };

  return { authToken, setAuthToken, removeAuthToken };
};

export default useAuthToken;