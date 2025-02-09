// authUtils.ts
export const setAuthToken = (token: string) => {
    localStorage.setItem('userToken', token);
  };
  
  export const getAuthToken = () => {
    return localStorage.getItem('userToken');
  };
  
  export const removeAuthToken = () => {
    localStorage.removeItem('userToken');
  };
  
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };