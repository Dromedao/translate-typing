import { useTranslation } from "react-i18next";
import SettingsCss from "../styles/Settings.module.css";

export default function Settings() {
  const { t } = useTranslation();
  return (
    <main className={SettingsCss["main-settings"]}>
      <h1>{t("settings")}</h1>
      <h2>{t("coming-soon")}</h2>
    </main>
  );
}
