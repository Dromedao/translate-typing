import { useEffect, useState } from "react";

import TranslateMode from "../components/TranslateMode";
import TypingMode from "../components/TypingMode";
import OptionsBar from "../components/OptionsBar";

import HomeCss from "../styles/Home.module.css";

import { DefaultPhrases } from "../components/DefaultPhrases";

import GithubMark from "../assets/github-mark.svg";

export default function Home() {
  // 0: TypingMode
  // 1: TranslateMode
  const [mode, setMode] = useState(0);

  const [selectedLanguageFrom, setSelectedLanguageFrom] = useState("english");
  const [selectedLanguageTo, setSelectedLanguageTo] = useState("spanish");
  const [selectedLevel, setSelectedLevel] = useState("A1");

  const [phrase, setPhrase] = useState(
    "Click the button to generate a new phrase"
  );

  const [translatedPhrase, setTranslatedPhrase] = useState(
    "Haga clic en el botón para generar una nueva frase"
  );

  useEffect(() => {
    if (selectedLanguageFrom in DefaultPhrases) {
      setPhrase(
        DefaultPhrases[selectedLanguageFrom as keyof typeof DefaultPhrases]
      );
    } else {
      setPhrase("");
    }
    if (selectedLanguageTo in DefaultPhrases) {
      setTranslatedPhrase(
        DefaultPhrases[selectedLanguageTo as keyof typeof DefaultPhrases]
      );
    } else {
      setTranslatedPhrase("");
    }
  }, [mode]);

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
            Typing Mode
          </button>
          <button
            className={`${HomeCss["change-mode__btn"]} ${
              mode === 1 ? HomeCss["active"] : ""
            }`}
            onClick={() => setMode(1)}
          >
            Translate Mode
          </button>
        </div>
        <OptionsBar
          typingMode={mode === 0 ? true : false}
          vars={[selectedLanguageFrom, selectedLanguageTo, selectedLevel]}
          setVars={[
            setSelectedLanguageFrom,
            setSelectedLanguageTo,
            setSelectedLevel,
            setPhrase,
            setTranslatedPhrase,
          ]}
        />
        {mode ? (
          <TranslateMode
            phrase={phrase}
            selectedLanguageFrom={selectedLanguageFrom}
            selectedLanguageTo={selectedLanguageTo}
            selectedLevel={selectedLevel}
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
      <a style={{position: "absolute", bottom: "10px", right: "20px"}} href="https://github.com/Dromedao">
        <img style={{width: "50px"}} src={GithubMark} alt="" />
      </a>
    </>
  );
}
