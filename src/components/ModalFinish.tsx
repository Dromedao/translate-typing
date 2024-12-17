import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalFinishCss from "../styles/ModalFinish.module.css";
import ReCAPTCHA from "react-google-recaptcha";
import { API_URL } from "../config/apiConfig";

type User = {
  username: string;
  avg_wpm: Number;
  avg_typing_accuracy: Number;
  avg_translate_accuracy: Number;
  total_typing_tests: Number;
  total_translate_tests: Number;
};

type ModalProps = {
  typingTest: boolean;
  mistakes?: number;
  setMistakes?: Dispatch<SetStateAction<number>>;
  time_start: number;
  setTimeStart: Dispatch<SetStateAction<number | null>>;
  time_finish: number;
  setTimeFinish: Dispatch<SetStateAction<number | null>>;
  setModalFinish: Dispatch<SetStateAction<boolean>>;
  setText: Dispatch<SetStateAction<string>>;
  realText: string;
  userText: string;
  handleClickOutside?: () => void;
  languageFrom: string;
  languageTo: string;
  level: string;
};

export default function ModalFinish({
  typingTest,
  setMistakes,
  time_start,
  setTimeStart,
  time_finish,
  setTimeFinish,
  setModalFinish,
  setText,
  handleClickOutside,
  realText,
  userText,
  languageFrom,
  languageTo,
  level,
}: ModalProps) {
  const [modal, setModal] = useState(true);
  const [saved, setSaved] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [translationAccuracy, setTranslationAccuracy] = useState<number | null>(
    null
  );
  const [typingAccuracy, setTypingAccuracy] = useState<string | null>(null);
  const [idTypingTest, setIdTypingTest] = useState("");
  const [idTranslateTest, setIdTranslateTest] = useState("");
  const totalTime = ((time_finish - time_start) / 1000).toFixed(2);

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const toggleModal = () => {
    setModal(!modal);
    setModalFinish(false);
    if (setMistakes) {
      setMistakes(0);
    }
    setTimeStart(Date.now());
    setTimeFinish(null);
    setText("");
    if (handleClickOutside) {
      handleClickOutside();
    }
  };

  const handleUpdateTranslateStats = async () => {
    if (!user) {
      console.error("Useris not available");
      return;
    }

    const avgTranslateAccuracy =
      Math.round(Number(user.avg_translate_accuracy)) || 0;
    const totalTranslateTests = Number(user.total_translate_tests) || 0;

    try {
      const res = await fetch(`${API_URL}/users/translate-stats/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
        body: JSON.stringify({
          username: user.username,
          avg_translate_accuracy: Math.round(
            (avgTranslateAccuracy * totalTranslateTests +
              Math.round(Number(translationAccuracy))) /
              (totalTranslateTests + 1)
          ),
          total_translate_tests: totalTranslateTests + 1,
        }),
        credentials: "include",
      });

      if (res.ok) {
        console.log("Translation stats updated successfully");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleUpdateTypingStats = async () => {
    if (!user) {
      console.error("User is not available");
      return;
    }

    const avgTypingAccuracy = Math.round(Number(user.avg_typing_accuracy)) || 0;
    const totalTypingTests = Number(user.total_typing_tests) || 0;
    const avgWPM = Math.round(Number(user.avg_wpm)) || 0;

    let calculatedAccuracy = Number(
      calculateTypingAccuracy(realText, userText)
    );
    let calculatedWPM = Number(
      calculateWPM(realText, userText, Number(totalTime))
    );

    if (isNaN(calculatedAccuracy)) {
      calculatedAccuracy = 0;
    }
    if (isNaN(calculatedWPM)) {
      calculatedWPM = 0;
    }

    try {
      const res = await fetch(`${API_URL}/users/typing-stats/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
        body: JSON.stringify({
          username: user.username,
          avg_typing_accuracy: Math.round(
            (avgTypingAccuracy * totalTypingTests +
              Math.round(calculatedAccuracy)) /
              (totalTypingTests + 1)
          ),
          avg_wpm: Math.round(
            (avgWPM * totalTypingTests + Math.round(calculatedWPM)) /
              (totalTypingTests + 1)
          ),
          total_typing_tests: totalTypingTests + 1,
        }),
        credentials: "include",
      });

      if (res.ok) {
        console.log("Saved");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleSaveTypingTest = async () => {
    // if (!user?.id) {
    //   console.error("User ID is not available");
    //   return;
    // }

    if (!realText || !userText || !totalTime) {
      console.error("Missing test data: realText, userText, or totalTime");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/typing-tests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
        body: JSON.stringify({
          // user_id: user.id.toString(),
          wpm: calculateWPM(realText, userText, Number(totalTime)),
          accuracy: calculateTypingAccuracy(realText, userText),
          test_duration: totalTime,
          language_from: languageFrom,
          language_to: languageTo,
          level: level,
        }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setIdTypingTest(data.id);

        setSaved(true);
        console.log("Test saved successfully");

        // await handleUpdateTypingStats();
      } else {
        const data = await res.json();
        console.error("Error saving test:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleDeleteTypingTest = async () => {
    if (!user) {
      console.error("User is not available");
      return;
    }

    if (!idTypingTest) {
      console.error("Missing test data: idTypingTest");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/typing-tests/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
        body: JSON.stringify({
          id: idTypingTest,
        }),
        credentials: "include",
      });

      if (res.ok) {
        setSaved(false);
        console.log("Test deleted successfully");
      } else {
        const data = await res.json();
        console.error("Error saving test:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleDeleteTranslateTest = async () => {
    if (!user) {
      console.error("User is not available");
      return;
    }

    if (!idTranslateTest) {
      console.error("Missing test data: idTranslateTest");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/translation-tests/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
        body: JSON.stringify({
          id: idTranslateTest,
        }),
        credentials: "include",
      });

      if (res.ok) {
        setSaved(false);
        console.log("Test deleted successfully");

        // await handleUpdateTypingStats();
      } else {
        const data = await res.json();
        console.error("Error saving test:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleSaveTranslationTest = async () => {
    if (!user) {
      console.error("User is not available");
      return;
    }

    if (!captchaValue) {
      console.error("Captcha verification failed");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/translation-tests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
        body: JSON.stringify({
          // user_id: user.id.toString(),
          phrase_text: realText,
          user_translation: userText,
          accuracy: translationAccuracy,
          test_duration: totalTime,
          // language_from: languageFrom,
          language_to_name: languageTo,
          level_name: level,
        }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setIdTranslateTest(data.id);
        setSaved(true);
      } else {
        const data = await res.json();
        console.error("Error saving test:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const calculateTypingAccuracy = (
    targetText: string,
    userText: string
  ): string => {
    let numberCorrectCharacters = 0;

    for (let i = 0; i < userText.length; i++) {
      if (userText[i] === targetText[i]) {
        numberCorrectCharacters++;
      } else {
        break;
      }
    }
    const accuracy = (numberCorrectCharacters / targetText.length) * 100;
    return accuracy.toFixed(2);
  };

  const calculateWPM = (
    targetText: string,
    userText: string,
    elapsedTimeInSeconds: number
  ): number => {
    let correctCharacters = 0;

    for (let i = 0; i < userText.length; i++) {
      if (userText[i] === targetText[i]) {
        correctCharacters++;
      } else {
        break;
      }
    }

    const elapsedTimeInMinutes = elapsedTimeInSeconds / 60;

    const wpm = correctCharacters / 5 / elapsedTimeInMinutes;

    return Math.round(wpm);
  };

  const calculateTranslationAccuracy = async (
    targetText: string,
    userText: string
  ) => {
    try {
      const res = await fetch(`${API_URL}/translate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
        body: JSON.stringify({
          originalText: targetText,
          proposedTranslation: userText,
          targetLanguage: languageTo,
          captcha: captchaValue,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al calcular la precisión");
      }

      const data = await res.json();
      setTranslationAccuracy(data.accuracy);
      setErrors(data.errors || []);
    } catch (error) {
      setTranslationAccuracy(-1);
      setErrors([
        "An issue occurred while calculating accuracy. Please try again later.",
        "Ha ocurrido un problema al calcular la presición. Por favor intentelo más tarde.",
        "Un problème est survenu lors du calcul de la précision. Veuillez réessayer plus tard.",
      ]);
      console.error("Error al calcular la precisión:", error);
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/users/info`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          'X-Requested-With': 'fetch',
        },
      });

      
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      // const updateUserStats = async () => {
      //   if (typingTest) {
      //     await handleUpdateTypingStats();
      //   } else {
      //   }
      // };
      // updateUserStats();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (captchaValue) {
      calculateTranslationAccuracy(realText, userText);
    }
  }, [captchaValue]);

  useEffect(() => {
    const updateUserStats = async () => {
      if (typingTest) {
        await handleUpdateTypingStats();
      } else {
        await handleUpdateTranslateStats();
      }
    };
    updateUserStats();
  }, [user]);

  useEffect(() => {
    if (typingTest) {
      setTypingAccuracy(calculateTypingAccuracy(realText, userText));
    }
    const updateUserStats = async () => {
      if (typingTest) {
        await handleUpdateTypingStats();
      }
    };
    getUserInfo();
    updateUserStats();
  }, []);

  if (loading) {
    return <div style={{ position: "absolute", top: "50%" }}>Loading...</div>;
  }

  return (
    <>
      {modal && typingTest ? (
        <div className={ModalFinishCss["modal"]}>
          <div
            onClick={toggleModal}
            className={ModalFinishCss["modal__overlay"]}
          ></div>
          <div className={ModalFinishCss["modal__content"]}>
            <h2 style={{ padding: 0, margin: 0 }}>Finish test!</h2>
            <p>Accuracy: {typingAccuracy}%</p>
            <p>Total time: {totalTime} [s]</p>
            <p>
              WPM:{" "}
              {isNaN(calculateWPM(realText, userText, Number(totalTime)))
                ? "0%"
                : calculateWPM(realText, userText, Number(totalTime))}
            </p>
            {user ? (
              !saved ? (
                <button
                  className={ModalFinishCss["modal__btn"]}
                  onClick={handleSaveTypingTest}
                >
                  Save test
                </button>
              ) : (
                <button
                  className={ModalFinishCss["modal__btn"]}
                  onClick={handleDeleteTypingTest}
                >
                  Delete test
                </button>
              )
            ) : (
              <p>Login to save tests</p>
            )}
          </div>
        </div>
      ) : (
        <div className={ModalFinishCss["modal"]}>
          <div
            onClick={toggleModal}
            className={ModalFinishCss["modal__overlay"]}
          ></div>
          <div className={ModalFinishCss["modal__content"]}>
            <h2>Finish test!</h2>
            <p>Total time: {totalTime} [s]</p>
            <p>Text to translate: {realText}</p>
            <p>Translation: {userText}</p>
            <p>
              {captchaValue === null ? (
                <p>Complete the captcha to see the result</p>
              ) : (
                <p>
                  Accuracy:{" "}
                  {translationAccuracy !== null
                    ? `${translationAccuracy}%`
                    : "Calculating..."}
                </p>
              )}
            </p>
            {errors.length > 0 && (
              <div>
                <h4>Errors:</h4>
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <ReCAPTCHA
              className={ModalFinishCss["g-recaptcha"]}
              sitekey="6LeI644qAAAAAIs0jtKxxo8XjGliw24uQq9WULlt"
              onChange={handleCaptchaChange}
              theme="dark"
            />
            {user ? (
              !saved ? (
                <button
                  className={ModalFinishCss["modal__btn"]}
                  onClick={handleSaveTranslationTest}
                >
                  Save test
                </button>
              ) : (
                <button
                  className={ModalFinishCss["modal__btn"]}
                  onClick={handleDeleteTranslateTest}
                >
                  Delete test
                </button>
              )
            ) : (
              <p>Login to save tests</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
