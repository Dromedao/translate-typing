import { useState, useRef } from "react";
import ModalFinish from "./ModalFinish";
import TypingModeCss from "../styles/TypingMode.module.css";

type TypingMode = {
  selectedLanguageFrom: string;
  selectedLanguageTo: string;
  selectedLevel: string;
  phrase: string;
  translatedPhrase: string;
};

export default function TypingMode({
  selectedLanguageFrom,
  selectedLanguageTo,
  selectedLevel,
  phrase,
  translatedPhrase,
}: TypingMode) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(true);

  const [timeStart, setTimeStart] = useState<number | null>(null);
  const [timeFinish, setTimeFinish] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    if (userInput.length > translatedPhrase.length || showModal) {
      return;
    }

    setText(e.target.value);

    if (
      userInput[userInput.length - 1] !== translatedPhrase[userInput.length - 1]
    ) {
      console.log(
        userInput[userInput.length - 1],
        translatedPhrase[userInput.length - 1]
      );
      setTimeFinish(Date.now());
      setShowModal(true);
    }

    if (userInput.length === translatedPhrase.length && !showModal) {
      setTimeFinish(Date.now());
      setShowModal(true);
    }

    if (userInput.length > 0 && timeStart === null) {
      setTimeStart(Date.now());
    }
  };

  const handleClickOutside = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <p className={TypingModeCss["main-form__appointment"]}>«{phrase}»</p>
      <div onClick={handleClickOutside} className={TypingModeCss["main-div"]}>
        <input
          ref={inputRef}
          className={TypingModeCss["main-input"]}
          onChange={handleChange}
          type="text"
          value={text}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus
        />
        <p className={TypingModeCss["text-output"]}>
          {`${translatedPhrase} `.split("").map((char, index) => (
            <span
              key={index}
              className={`${
                index < text.length
                  ? text[index] === char
                    ? TypingModeCss["correct"]
                    : TypingModeCss["incorrect"]
                  : isFocused && index === text.length
                  ? TypingModeCss["caret-container"]
                  : TypingModeCss["no-text"]
              } ${
                index === text.length
                  ? TypingModeCss["current-char"]
                  : TypingModeCss["pass-character"]
              }`}
            >
              {index < text.length && text[index] !== char
                ? text[index] == " "
                  ? "\u00A0"
                  : text[index]
                : char}
            </span>
          ))}
        </p>
      </div>
      {showModal && (
        <ModalFinish
          typingTest={true}
          mistakes={1}
          time_start={Number(timeStart)}
          setTimeStart={setTimeStart}
          time_finish={Number(timeFinish)}
          setTimeFinish={setTimeFinish}
          setModalFinish={setShowModal}
          setText={setText}
          handleClickOutside={handleClickOutside}
          realText={translatedPhrase}
          userText={text}
          languageFrom={selectedLanguageFrom}
          languageTo={selectedLanguageTo}
          level={selectedLevel}
        />
      )}
    </>
  );
}
