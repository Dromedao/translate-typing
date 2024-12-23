import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalList from "./ModalList";
import TextFields from "../assets/text_fields.svg";
// import Segment from "../assets/segment.svg";
import Star from "../assets/star.svg";
import Restart from "../assets/restart.svg";
import OptionsBarCss from "../styles/OptionsBar.module.css";
import { CannotFetchDatabase } from "./CannotFetchDatabase";
import { API_URL } from "../config/apiConfig";
import { useTranslation } from "react-i18next";
import { languagesDiminutive, languages } from "../LanguagesSystem.ts";
import { useLanguage } from "../LanguageContext.tsx";
import Sync from "../assets/sync.svg";

type OptionsBarProps = {
  typingMode: boolean;
  vars: string[];
  setVars: Dispatch<SetStateAction<string>>[];
  setTranslateTimeStart?: Dispatch<SetStateAction<number | null>>;
};

export default function OptionsBar({
  typingMode,
  vars,
  setVars,
  setTranslateTimeStart,
}: OptionsBarProps) {
  const { t } = useTranslation();
  // const languages = [
  //   "english",
  //   "spanish",
  //   "french",
  //   "arabic",
  //   "italian",
  //   "chinese",
  //   "korean",
  //   "german",
  //   "dutch",
  //   "turkish",
  //   "hindi",
  //   "portuguese",
  //   "japanese",
  //   "russian",
  // ];
  const { selectedLanguage } = useLanguage();

  function convertToFullLanguage(abbreviation: string): string {
    const index = languagesDiminutive.indexOf(abbreviation);
    return index !== -1 ? languages[index] : "unknown";
  }
  // const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const levels = ["A1", "A2", "B1", "B2"];

  const [errorFetchPhrase, setErrorFetchPhrase] = useState(false);
  useEffect(() => {
    if (errorFetchPhrase) {
      if (vars[0] in CannotFetchDatabase) {
        setVars[3](
          CannotFetchDatabase[
            vars[0] as keyof typeof CannotFetchDatabase
          ]
        );
      } else {
        setVars[3]("");
      }
      if (vars[1] in CannotFetchDatabase) {
        setVars[4](
          CannotFetchDatabase[vars[1] as keyof typeof CannotFetchDatabase]
        );
      } else {
        setVars[4]("");
      }
      setErrorFetchPhrase(false);
    }
  }, [errorFetchPhrase]);


  const handleGeneratePhrase = async () => {
    try {
        if (!vars[0] || !vars[2]) {
        console.error("Missing language or level!");
        return;
      }
      const res = await fetch(`${API_URL}/multilingual-phrases/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({
          // language: vars[0],
          language: vars[0],
          level: vars[2],
        }),
        credentials: "include",
      });

      if (!res.ok) {
        // Manejo de error de respuesta
        const errorData = await res.json();
        throw new Error(
          `Error looking for a phrase: ${errorData.error || "Unknown error"}`
        );
      }

      const data = await res.json();
      const indexPhrase = Math.floor(Math.random() * data.length);
      setVars[3](data[indexPhrase]?.phrase || "No phrase available");

      if (typingMode) {
        const res2 = await fetch(`${API_URL}/multilingual-phrases/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "fetch",
          },
          body: JSON.stringify({
            language: vars[1],
            level: vars[2],
          }),
          credentials: "include",
        });

        if (!res2.ok) {
          // Manejo de error de respuesta para la segunda petición
          const errorData2 = await res2.json();
          throw new Error(
            `Error looking for a phrase in typing mode: ${
              errorData2.error || "Unknown error"
            }`
          );
        }
        const data2 = await res2.json();
        setVars[4](data2[indexPhrase]?.phrase || "No phrase available");
      } else {
        //Translate Mode
        if (setTranslateTimeStart) {
          setTranslateTimeStart(Date.now());
        }
      }
    } catch (error) {
      // Manejo de errores generales (excepciones)
      //language: vars[0],
      //level: vars[2],
      setErrorFetchPhrase(true);
      // console.error("An error occurred:", error);
    }
  };

  useEffect(()=>{
    setVars[0](convertToFullLanguage(selectedLanguage))
    console.log(vars)
  },[])

  const exchangeLanguages = () => {
    const aux = vars[0]
    setVars[0](vars[1])
    setVars[1](aux)
  }

  return (
    <div className={OptionsBarCss["main-form__option-container"]}>
      {/* <ModalList
        title={`From: ${vars[0]}`}
        items={languages}
        setVar={setVars[0]}
        image={Segment}
        uniqueId="languageFrom"
      /> */}
      <ModalList
        title={`${t("to")}: ${vars[1]}`}
        items={languages}
        setVar={setVars[1]}
        image={TextFields}
        uniqueId="languageTo"
      />
      <ModalList
        title={`${t("level")}: ${vars[2]}`}
        items={levels}
        setVar={setVars[2]}
        image={Star}
        uniqueId="level"
      />
      {!typingMode ? (
        <>
          <label htmlFor="">
            <img src={Sync} alt="Sync icon" />
            <button
            className={OptionsBarCss["main-form__generate-button"]}
            onClick={exchangeLanguages}
            >{t("change-direction")}</button>
          </label>
        </>
      ) : (
        <></>
      )}
      <label htmlFor="generate-button">
        <img src={Restart} alt="Restart icon" />
        <button
          id="generate-button"
          type="button"
          className={OptionsBarCss["main-form__generate-button"]}
          onClick={handleGeneratePhrase}
        >
          {t("generate-button")}
        </button>
      </label>
    </div>
  );
}
