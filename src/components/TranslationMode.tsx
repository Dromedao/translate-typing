import { useState, useRef, ChangeEvent, Dispatch, SetStateAction } from "react";
import TranslateModeCss from "../styles/TranslateMode.module.css";
import ModalFinish from "./ModalFinish";
import { useTranslation } from "react-i18next";

type TranslationMode = {
  phrase: string;
  selectedLanguageFrom: string;
  selectedLanguageTo: string;
  selectedLevel: string;
  timeStart: number;
  setTimeStart: Dispatch<SetStateAction<number | null>>;
};

export default function TranslationMode({
  phrase,
  selectedLanguageFrom,
  selectedLanguageTo,
  selectedLevel,
  timeStart,
  setTimeStart,
}: TranslationMode) {
  const [text, setText] = useState("");
  const { t } = useTranslation();
  const [timeFinish, setTimeFinish] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errorSendEmpty, setErrorSendEmpty] = useState(false);
  const [errorSendNoGenerate, setErrorSendNoGenerate] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    if (event.target.value.length > 0 && timeStart === null) {
      setTimeStart(Date.now());
    }
    setText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      // Check if text is not empty
      if (text.trim().length === 0) {
        setErrorSendEmpty(true);
        event.preventDefault();
        return;
      }

      setErrorSendEmpty(false);
      setTimeFinish(Date.now());
      setShowModal(true);
    }
  };

  const handleButtonClick = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (text.trim().length === 0) {
      setErrorSendEmpty(true);
      event?.preventDefault();
      if (timeStart != 0) {
        setErrorSendNoGenerate(false);
      }
      return;
    }
    if (timeStart === 0) {
      setErrorSendNoGenerate(true);
      event?.preventDefault();
      if (text.trim().length != 0) {
        setErrorSendEmpty(false);
      }
      return;
    }
    setErrorSendEmpty(false);
    setErrorSendNoGenerate(false);
    console.log("timeStart ", timeStart);
    setTimeFinish(Date.now());
    setShowModal(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={TranslateModeCss["main-form"]}>
        <p className={TranslateModeCss["main-form__appointment"]}>❝{phrase}❞</p>
        <textarea
          ref={textareaRef}
          className={TranslateModeCss["main-form__input"]}
          placeholder={t("textarea-placeholder")}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {errorSendEmpty ? <p>Cannot send traduction empty</p> : <></>}
        {errorSendNoGenerate ? (
          <p>Cannot send without generate a phrase</p>
        ) : (
          <></>
        )}
        <button
          onClick={handleButtonClick}
          className={TranslateModeCss["send-btn"]}
        >
          {t("send")}
        </button>
        <p style={{ textAlign:"center", color: "grey" }}>{t("send-message")}</p>
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
