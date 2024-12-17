import { useState, useEffect } from "react";
import classes from "../styles/Account.module.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/apiConfig";

type User = {
  username: string;
  avg_wpm: Number;
  avg_typing_accuracy: Number;
  avg_translate_accuracy: Number;
  total_typing_tests: Number;
  total_translate_tests: Number;
};

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [typingTests, setTypingTests] = useState<any[]>([]);
  const [translationTests, setTranslationTests] = useState<any[]>([]);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
      });

      if (!res.ok) {
        throw new Error("Error logging out");
      }

      navigate("/");
    } catch (error) {
      alert("There was a problem logging out. Please try again.");
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/users/info`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
      });

      if (!res.ok) {
        try {
          const res = await fetch(`${API_URL}/users/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "fetch",
            },
          });

          if (!res.ok) {
            throw new Error("Error logging out");
          }
        } catch (error) {}
        throw new Error("Failed to fetch user information.");
      }
      const data = await res.json();
      setUser(data);
    } catch (error) {
      navigate("/login");
      console.error(error);
    }
  };

  const getTests = async () => {
    try {
      const typingResPromise = fetch(`${API_URL}/typing-tests/tests`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
      });
      const translationResPromise = fetch(
        `${API_URL}/translation-tests/tests`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "fetch",
          },
        }
      );

      const [typingRes, translationRes] = await Promise.all([
        typingResPromise,
        translationResPromise,
      ]);

      if (typingRes.ok) {
        const typingData = await typingRes.json();
        setTypingTests(typingData);
      } else {
        console.error("Error finding typing tests");
      }
      if (translationRes.ok) {
        const translationData = await translationRes.json();
        setTranslationTests(translationData);
      } else {
        console.error("Error finding translation tests");
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    getTests();
  }, []);

  if (loading) {
    return <div style={{ position: "absolute", top: "50%" }}>Loading...</div>;
  }

  return (
    <main className={classes["main"]}>
      <h1 className={classes["welcome"]}>
        Welcome, {user ? user.username : "User"}
      </h1>
      <p>
        Total typing tests:{" "}
        {typingTests.length > Number(user?.total_typing_tests)
          ? typingTests.length
          : Number(user?.total_typing_tests)}
      </p>
      <p>Typing average wpm: {Number(user?.avg_wpm)}</p>
      <p>
        Typing Accuracy Average:{" "}
        {user?.avg_typing_accuracy !== null
          ? `${user?.avg_typing_accuracy}%`
          : "0%"}
      </p>
      <p>
        Total translate tests:{" "}
        {translationTests.length > Number(user?.total_translate_tests)
          ? translationTests.length
          : Number(user?.total_translate_tests)}
      </p>
      <p>
        Translation Accuracy Average: {Number(user?.avg_translate_accuracy)}%
      </p>
      <div className={classes["grid-container"]}>
        <article className={classes["tests-container"]}>
          <p style={{ marginBottom: "10px" }}>Saved typing tests</p>
          <div className={classes["scrollable-container"]}>
            <ul className={classes["tests"]}>
              {typingTests.length > 0 ? (
                typingTests.map((test, index) => (
                  <li key={index} className={classes["tests__li"]}>
                    <p className={classes["li__p"]}>
                      Velocidad: {test.wpm} WPM
                    </p>
                    <p>Precisión: {test.accuracy}%</p>
                    <p>Duración: {test.test_duration} [s]</p>
                    <p>
                      Fecha: {new Date(test.test_date).toLocaleDateString()}
                    </p>
                  </li>
                ))
              ) : (
                <p>There are no typing tests associated with this user...</p>
              )}
            </ul>
          </div>
        </article>
        <article className={classes["tests-container"]}>
          <p style={{ marginBottom: "10px" }}>Saved translate tests</p>
          <div className={classes["scrollable-container"]}>
            <ul className={classes["tests"]}>
              {translationTests.length > 0 ? (
                translationTests.map((test) => (
                  <li key={test.id} className={classes["tests__li"]}>
                    <p>Original Language: {test.language_from}</p>
                    <p>Phrase: {test.phrase}</p>
                    <p>Destination Language: {test.language_to}</p>
                    <p>Translation: {test.user_translation}</p>
                    <p>Accuracy {test.accuracy}%</p>
                    <p>Duración: {test.test_duration} [s]</p>
                    <p>
                      Fecha: {new Date(test.test_date).toLocaleDateString()}
                    </p>
                  </li>
                ))
              ) : (
                <p>There are no translate tests associated with this user...</p>
              )}
            </ul>
          </div>
        </article>
      </div>
      <button onClick={logout} className={classes["logout-btn"]}>
        Log out
      </button>
    </main>
  );
}
