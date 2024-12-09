import { useState, useRef, ChangeEvent } from "react";
import TranslateModeCss from "../styles/TranslateMode.module.css";
import ModalFinish from "./ModalFinish";

type TranslateMode = {
  phrase: string;
  selectedLanguageFrom: string;
  selectedLanguageTo: string;
  selectedLevel: string;
};

export default function TranslateMode({
  phrase,
  selectedLanguageFrom,
  selectedLanguageTo,
  selectedLevel,
}: TranslateMode) {
  const [text, setText] = useState("");

  const [timeStart, setTimeStart] = useState<number | null>(null); 
  const [timeFinish, setTimeFinish] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    if (event.target.value.length > 0 && timeStart === null) {
      setTimeStart(Date.now());
    }
    setText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Formulario enviado con el texto:", text);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      console.log(selectedLanguageFrom, selectedLanguageTo, selectedLevel);
      setTimeFinish(Date.now());
      setShowModal(true);
    }
  };

  const handleButtonClick = () => {
    setTimeFinish(Date.now());
    setShowModal(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={TranslateModeCss["main-form"]}>
        <p className={TranslateModeCss["main-form__appointment"]}>«{phrase}»</p>
        <textarea
          ref={textareaRef}
          className={TranslateModeCss["main-form__input"]}
          placeholder="Write the translation"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          onClick={handleButtonClick}
          className={TranslateModeCss["send-btn"]}
        >
          Send
        </button>
        <p style={{color: "grey"}} >You can also send with enter key</p>
      </form>
      {showModal && (
        <ModalFinish
          typingTest={false}
          time_start={Number(timeStart)}
          setTimeStart={setTimeStart}
          time_finish={Number(timeFinish)}
          setTimeFinish={setTimeFinish}
          setModalFinish={setShowModal}
          setText={setText}
          realText={phrase}
          userText={text}
          languageFrom={selectedLanguageFrom}
          languageTo={selectedLanguageTo}
          level={selectedLevel}
        />
      )}
    </>
  );
}
