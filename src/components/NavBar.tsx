import Logo from "./Logo";
import NavBarCss from "../styles/NavBar.module.css";
import { Link } from "react-router-dom";

import Settings from "../assets/settings.svg";
import Leaderboard from "../assets/leaderboard.svg";
import Person from "../assets/person.svg";

import ModalList from "./ModalList";
// import { useState, useContext } from "react";

// import unknownFlag from "../assets/unknown-flag.svg";
import translate from "../assets/translate.svg";
import { useLanguage } from "../LanguageContext";

export default function NavBar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const { setSelectedLanguage } = useLanguage();
  const languages = [
    "en",
    "es",
    "fr",
    "ar",
    "it",
    "zh",
    "ko",
    "de",
    "nl",
    "tr",
    "hi",
    "pt",
    "ja",
    "ru",
  ];
  return (
    <nav className={NavBarCss["nav-bar"]}>
      <Link
        to="/"
        className={`${NavBarCss["nav-bar__link"]}  ${NavBarCss["logo"]}`}
      >
        <Logo />
      </Link>
      <ul className={NavBarCss["nav-bar__list"]}>
        <li>
          <Link to="/leaderboard" className={NavBarCss["nav-bar__link"]}>
            <img src={Leaderboard} alt="" />
          </Link>
        </li>
        <li>
          {isAuthenticated ? (
            <Link to="/account" className={NavBarCss["nav-bar__link"]}>
              <img src={Person} alt="Account" />
            </Link>
          ) : (
            <Link to="/login" className={NavBarCss["nav-bar__link"]}>
              <img src={Person} alt="Login" />
            </Link>
          )}
        </li>
        <li>
          <Link to="/settings" className={NavBarCss["nav-bar__link"]}>
            <img src={Settings} alt="" />
          </Link>
        </li>
        <li>
          <ModalList
            // title={`${selectedLanguage}`}
            title=""
            items={languages}
            setVar={setSelectedLanguage}
            image={translate}
            uniqueId="languageFrom"
            changeLanguage={true}
          />
        </li>
      </ul>
    </nav>
  );
}
