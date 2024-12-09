import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const protectedRoutes = ["/","/account", "/login"];

  const location = useLocation();
  const checkAuthentication = async () => {
    try {
      const response = await fetch("http://localhost:4000/users/profile", {
        method: "GET",
        credentials: "include",
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
