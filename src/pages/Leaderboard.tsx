import { useTranslation } from "react-i18next";
import LeaderboardCss from "../styles/Leaderboard.module.css";

export default function Leaderboard() {
  const { t } = useTranslation();
  return (
    <main className={LeaderboardCss["main-leaderboard"]}>
      <h1>{t("leaderboard")}</h1>
      <h2>{t("coming-soon")}</h2>
    </main>
  );
}
