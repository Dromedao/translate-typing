import { useEffect, useState } from "react";
import TranslationMode from "../components/TranslationMode";
import TypingMode from "../components/TypingMode";
import OptionsBar from "../components/OptionsBar";
import HomeCss from "../styles/Home.module.css";
import GithubMark from "../assets/github-mark.svg";
import { useTranslation } from "react-i18next";
import { DefaultPhrases } from "../components/DefaultPhrases";

type Language =
  | "english"
  | "spanish"
  | "french"
  | "arabic"
  | "italian"
  | "chinese"
  | "korean"
  | "german"
  | "dutch"
  | "turkish"
  | "hindi"
  | "portuguese"
  | "japanese";

type Mode = 0 | 1;

export default function Home() {
  const [mode, setMode] = useState<Mode>(0);
  const [translateTimeStart, setTranslateTimeStart] = useState<number | null>(
    null
  );

  const [selectedLanguageFrom, setSelectedLanguageFrom] = useState("english");
  const [selectedLanguageTo, setSelectedLanguageTo] = useState("spanish");
  const [selectedLevel, setSelectedLevel] = useState("A1");

  const { t, i18n } = useTranslation();

  const [phrase, setPhrase] = useState(t("click-to-generate"));
  const [translatedPhrase, setTranslatedPhrase] = useState(
    "Haga clic en el botón para generar una nueva frase"
  );
  const [clickPhase, setClickPhase] = useState(true);

  useEffect(() => {
    if (i18n.language === "es") {
      setSelectedLanguageTo("english");
    }
  }, []);

  useEffect(() => {
    if (clickPhase) {
      setPhrase(t("click-to-generate"));
      setClickPhase(true);
    }
  }, [mode, t]);

  useEffect(() => {
    if (clickPhase) {
      if (typeof DefaultPhrases[selectedLanguageTo as Language] === "string") {
        setTranslatedPhrase(DefaultPhrases[selectedLanguageTo as Language]);
      } else {
        console.error("Translation not found for", selectedLanguageTo);
      }
    }
  }, [clickPhase, selectedLanguageTo]);

  return (
    <>
      <main className={HomeCss["main"]}>
        <div className={HomeCss["change-mode"]}>
          <button
            className={`${HomeCss["change-mode__btn"]} ${
              mode === 0 ? HomeCss["active"] : ""
            }`}
            onClick={() => setMode(0)}
          >
            {t("typing-mode")}
          </button>
          <button
            className={`${HomeCss["change-mode__btn"]} ${
              mode === 1 ? HomeCss["active"] : ""
            }`}
            onClick={() => setMode(1)}
          >
            {t("translation-mode")}
          </button>
        </div>
        <OptionsBar
          typingMode={mode === 0}
          vars={[selectedLanguageFrom, selectedLanguageTo, selectedLevel]}
          setVars={[
            setSelectedLanguageFrom,
            setSelectedLanguageTo,
            setSelectedLevel,
            setPhrase,
            setTranslatedPhrase,
          ]}
          setTranslateTimeStart={setTranslateTimeStart}
        />
        {mode ? (
          <TranslationMode
            phrase={phrase}
            selectedLanguageFrom={selectedLanguageFrom}
            selectedLanguageTo={selectedLanguageTo}
            selectedLevel={selectedLevel}
            timeStart={Number(translateTimeStart)}
            setTimeStart={setTranslateTimeStart}
          />
        ) : (
          <TypingMode
            selectedLanguageFrom={selectedLanguageFrom}
            selectedLanguageTo={selectedLanguageTo}
            selectedLevel={selectedLevel}
            phrase={phrase}
            translatedPhrase={translatedPhrase}
          />
        )}
      </main>
      <a
        target="_blank"
        style={{ position: "absolute", bottom: "10px", right: "20px" }}
        href="https://github.com/Dromedao/translate-typing/"
      >
        <img className={HomeCss["github"]} src={GithubMark} alt="GitHub" />
      </a>
    </>
  );
}
