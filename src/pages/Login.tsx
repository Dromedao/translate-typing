import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginCss from "../styles/Login.module.css";
import FormCss from "../styles/Form.module.css";
import { API_URL } from "../config/apiConfig";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorText = errorData?.error;

        // Mapear el error específico con el mensaje de traducción
        switch (errorText) {
          case "Invalid username":
            setErrorMessage("Invalid username");
            break;
          case "Invalid password":
            setErrorMessage("Invalid password");
            break;
          case "User not found":
            setErrorMessage("User not found");
            break;
          case "Please verify your account to log in":
            setErrorMessage("Please verify your account to log in");
            break;
          case "Invalid credentials":
            setErrorMessage("Invalid credentials");
            break;
          default:
            setErrorMessage("Failed to login. Please try again later.");
        }
        return;
        // throw new Error(errorText);
      }
      navigate("/");
    } catch (error) {
      // console.log(error);
      setErrorMessage("Failed to login. Please try again later.");
    }
  };

  return (
    <>
      <article className={LoginCss["login"]}>
        <form onSubmit={handleSubmit} className={FormCss["form"]}>
          <h1 className={FormCss["form__title"]}>{t("login")}</h1>
          <label htmlFor="username">{t("username")}</label>
          <input
            id="username"
            name="username"
            placeholder={t("username-placeholder")}
            className={FormCss["form__input"]}
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="password">{t("password")}</label>
          <input
            id="password"
            name="password"
            placeholder={t("password-placeholder")}
            className={FormCss["form__input"]}
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className={FormCss["form__button"]} type="submit">
            {t("send")}
          </button>
          {errorMessage && <p className={FormCss["error"]}>{errorMessage}</p>}
          <p>
            {t("account-question")}{" "}
            <Link to="/sign-up">{t("click-signup")}</Link>
          </p>
          <p>
            {t("new-verify-email")}{" "}
            <Link to="/verify-email">{t("click-verify-email")}</Link>
          </p>
        </form>
      </article>
    </>
  );
}
