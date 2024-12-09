import Logo from "./Logo";
import NavBarCss from "../styles/NavBar.module.css";
import { Link } from "react-router-dom";

import Settings from "../assets/settings.svg";
import Leaderboard from "../assets/leaderboard.svg";
import Person from "../assets/person.svg";

export default function NavBar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
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
      </ul>
    </nav>
  );
}
