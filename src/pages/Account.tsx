import { useState, useEffect } from "react";
import classes from "../styles/Account.module.css";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  username: string;
  email: string;
  avg_wpm: Number;
  avg_typing_accuracy: Number;
  avg_translate_accuracy: Number;
  total_typing_tests: Number;
  total_translate_tests: Number;
};

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [tests, setTests] = useState<any[]>([]);
  const [translationTests, setTranslationTests] = useState<any[]>([]);
  const [typingAccuracy, setTypingAccuracy] = useState<number | null>(null);
  const navigate = useNavigate();
  
  const getTestByUserId = async () => {
    try {
      if (!user?.id) {
        throw new Error("No se puede encontrar los tests asociados");
      }
      const res = await fetch(
        `http://localhost:4000/typing-tests/${user?.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Error al encontrar tests asociados");
      }

      const data = await res.json();
      setTests(data);

      if (data.length > 0) {
        const totalAccuracy = data.reduce(
          (sum: number, test: any) => sum + test.accuracy,
          0
        );
        setTypingAccuracy(totalAccuracy / data.length);
      } else {
        setTypingAccuracy(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTranslationTestByUserId = async () => {
    try {
      if (!user?.id) {
        throw new Error("No se puede encontrar los tests asociados");
      }
      const res = await fetch(
        `http://localhost:4000/translation-tests/${user?.id}`,
        {
          method: "GET",
          credentials: "include", 
        }
      );

      if (!res.ok) {
        throw new Error("Error al encontrar tests asociados");
      }

      const data = await res.json();
      setTranslationTests(data);

    } catch (error) {
      console.log(error);
    }
  };

  const getUserById = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/users/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al obtener los datos del usuario por ID");
      }

      const data = await res.json();
      setUser(data);
      console.log(data)
    } catch (error) {
      console.error(`Error fetching user by ID: ${error}`);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`http://localhost:4000/users/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }

        const data = await res.json();
        console.log("Perfil básico:", data);
        if (data?.id) {
          await getUserById(data.id);
        }
      } catch (error) {
        console.log(`Error fetching user data: ${error}`);
        navigate("/")
      } finally {
        setLoading(false); 
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      getTestByUserId();
      getTranslationTestByUserId();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={classes["main"]}>
      <h1 className={classes["welcome"]}>Welcome, {user ? user.username : "User"}</h1>
      <p>Total typing tests: {tests.length > Number(user?.total_typing_tests) ? tests.length : Number(user?.total_typing_tests)}</p>
      <p>Typing average wpm: {Number(user?.avg_wpm)}</p>
      <p>Typing Accuracy Average: {typingAccuracy !== null ? `${typingAccuracy.toFixed(2)}%` : "0%"}</p>
      <p>Total translate tests: {translationTests.length > Number(user?.total_translate_tests) ? translationTests.length : Number(user?.total_translate_tests)}</p>
      <p>Translation Accuracy Average: {Number(user?.avg_translate_accuracy)}%</p>
      <div className={classes["grid-container"]}>
        <article className={classes["tests-container"]}>
          <div className={classes["scrollable-container"]}>
            <ul className={classes["tests"]}>
              {tests.length > 0 ? (
                tests.map((test, index) => (
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
          <div className={classes["scrollable-container"]}>
            <ul className={classes["tests"]}>
              {translationTests.length > 0 ? (translationTests.map((test) => (
                <li key={test.id} className={classes["tests__li"]}>
                  <p>Original Language: {test.language_from}</p>
                  <p>Phrase: {test.phrase}</p>
                  <p>Destination Language: {test.language_to}</p>
                  <p>Translation: {test.user_translation}</p>
                  <p>Accuracy {test.accuracy}%</p>
                  <p>Duración: {test.test_duration} [s]</p>
                  <p>Fecha: {new Date(test.test_date).toLocaleDateString()}</p>
                </li>
              ))) :<p>There are no translate tests associated with this user...</p>}
            </ul>
          </div>
        </article>
      </div>
    </main>
  );
}
