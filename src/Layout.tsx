import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import { API_URL } from "./config/apiConfig";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const protectedRoutes = ["/","/account", "/login"];

  const location = useLocation();
  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate");
      }
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (protectedRoutes.includes(location.pathname)) {
      checkAuthentication();
    }
  }, [location.pathname]);

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
