import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalList from "./ModalList";

import TextFields from "../assets/text_fields.svg";
import Segment from "../assets/segment.svg";
import Star from "../assets/star.svg";
import Restart from "../assets/restart.svg";

import OptionsBarCss from "../styles/OptionsBar.module.css";

// import { DefaultPhrases as CannotFetchDatabase } from "./DefaultPhrases";
import { CannotFetchDatabase } from "./CannotFetchDatabase";

type OptionsBarProps = {
  typingMode: boolean;
  vars: string[];
  setVars: Dispatch<SetStateAction<string>>[];
};

export default function OptionsBar({
  typingMode,
  vars,
  setVars,
}: OptionsBarProps) {
  const languages = [
    "english",
    "spanish",
    "french",
    "arab",
    "italian",
    "chinese",
    "korean",
    "german",
    "dutch",
    "turkish",
    "hindi",
    "portuguese",
    "japanese",
  ];
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  // const handleGeneratePhrase = async () => {
  //   if (!vars[0] || !vars[2]) {
  //     console.error("Missing language or level!");
  //     return;
  //   }

  //   const res = await fetch("http://localhost:4000/multilingual-phrases/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       language: vars[0],
  //       level: vars[2],
  //     }),
  //     credentials: "include",
  //   });

  //   // console.log(res);
  //   const data = await res.json();

  //   if (res.ok) {
  //     const indexPhrase = Math.floor(Math.random() * data.length);
  //     setVars[3](data[indexPhrase].phrase);

  //     if (typingMode) {
  //       const res2 = await fetch(
  //         "http://localhost:4000/multilingual-phrases/",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             language: vars[1],
  //             level: vars[2],
  //           }),
  //           credentials: "include",
  //         }
  //       );
  //       const data2 = await res2.json();
  //       if (res2.ok) {
  //         setVars[4](data2[indexPhrase].phrase);
  //       }
  //     }
  //   } else {
  //     console.error(
  //       "Error looking for a phrase:",
  //       data.error || "Unknown error"
  //     );
  //   }
  // };

  // const [phrase, setPhrase] = useState(
  //   "Click the button to generate a new phrase"
  // );

  // const [translatedPhrase, setTranslatedPhrase] = useState(
  //   "Haga clic en el botón para generar una nueva frase"
  // );

  // [
  //   setSelectedLanguageFrom,
  //   setSelectedLanguageTo,
  //   setSelectedLevel,
  //   setPhrase,
  //   setTranslatedPhrase,
  // ]
  //[selectedLanguageFrom, selectedLanguageTo, selectedLevel]
  const [errorFetchPhrase, setErrorFetchPhrase] = useState(false)
  useEffect(() => {
    if (vars[0] in CannotFetchDatabase) {
      setVars[3](CannotFetchDatabase[vars[0] as keyof typeof CannotFetchDatabase]);
    } else {
      setVars[3]("");
    }
    if (vars[1] in CannotFetchDatabase) {
      setVars[4](CannotFetchDatabase[vars[1] as keyof typeof CannotFetchDatabase]);
    } else {
      setVars[4]("");
    }
    setErrorFetchPhrase(false)
  }, [errorFetchPhrase]);

  const handleGeneratePhrase = async () => {
    try {
      if (!vars[0] || !vars[2]) {
        console.error("Missing language or level!");
        return;
      }

      const res = await fetch("http://localhost:4000/multilingual-phrases/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        const res2 = await fetch(
          "http://localhost:4000/multilingual-phrases/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              language: vars[1],
              level: vars[2],
            }),
            credentials: "include",
          }
        );

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
      }
    } catch (error) {
      // Manejo de errores generales (excepciones)
      //language: vars[0],
      //level: vars[2],
      setErrorFetchPhrase(true);
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className={OptionsBarCss["main-form__option-container"]}>
      <ModalList
        title={`From: ${vars[0]}`}
        items={languages}
        setVar={setVars[0]}
        image={Segment}
        uniqueId="languageFrom"
      />
      <ModalList
        title={`To: ${vars[1]}`}
        items={languages}
        setVar={setVars[1]}
        image={TextFields}
        uniqueId="languageTo"
      />
      <ModalList
        title={`Level: ${vars[2]}`}
        items={levels}
        setVar={setVars[2]}
        image={Star}
        uniqueId="level"
      />
      <label htmlFor="generate-button">
        <img src={Restart} alt="Restart icon" />
        <button
          id="generate-button"
          type="button"
          className={OptionsBarCss["main-form__generate-button"]}
          onClick={handleGeneratePhrase}
        >
          Generate phrase
        </button>
      </label>
    </div>
  );
}
