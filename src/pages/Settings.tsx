import { useEffect, useState } from "react";
import SettingsCss from "../styles/Settings.module.css"
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const logout = async () => {
    try {
      const res = await fetch("http://localhost:4000/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al cerrar sesión");
      }

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:4000/users/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }

        const data = await res.json();
        console.log("Perfil básico:", data);
        if (data?.id) {
          await setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(`Error fetching user profile: ${error}`);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div style={{position: "absolute", top: "50%", left: "50%"}}>Loading...</div>; 
  }

  return (
    <main className={SettingsCss["main-settings"]}>      
      {isAuthenticated ? (<button onClick={logout} className={SettingsCss["logout-btn"]}>
        Log out
      </button>) : <h1>You can log out here, more options coming soon</h1>}
    </main>
  );
}
