export const initializeDarkMode = (): boolean => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? savedMode === 'true' : 
              window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };
  
  export const applyDarkMode = (isDarkMode: boolean): void => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  };