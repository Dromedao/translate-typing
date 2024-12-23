const apiConfig = {
    development: "http://localhost:4000",
    production: "https://translate-typing-backend-production.up.railway.app",
  };
  
  const getApiUrl = (): string => {
    const env = import.meta.env.MODE || "development";
    return apiConfig[env as keyof typeof apiConfig];
  };
  
  export const API_URL = getApiUrl();