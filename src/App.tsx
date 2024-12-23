import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Account from "./pages/Account";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; 
import { useEffect } from "react";
import { LanguageProvider } from "./LanguageContext"; 

function App() {
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </I18nextProvider>
  );
}

export default App;
