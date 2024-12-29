import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/apiConfig";
import FormCss from "../styles/Form.module.css";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import LoginCss from "../styles/Login.module.css";

export const VerifyEmail = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");

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
      const response = await fetch(`${API_URL}/users/new-verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorText = errorData?.error;

        // Mapear el error específico con el mensaje de traducción
        switch (errorText) {
          case "Invalid username":
            setErrorMessage(
              "Invalid username: must be at least 3 characters with no spaces"
            );
            break;
          case "User not found":
            setErrorMessage("User not found");
            break;
          case "Invalid credentials":
            setErrorMessage("Invalid credentials");
            break;
          case "User already verified":
            setErrorMessage("User already verified");
            break;
          case "Emails are not equal":
            setErrorMessage("Emails are not equal");
            break;
          default:
            setErrorMessage(
              "Failed to sent a new email. Please try again later."
            );
        }
        return;
        // throw new Error(errorText);
      }
      navigate("/login");
    } catch (error) {
      setErrorMessage("Failed to sent a new email. Please try again later.");
    }
  };
  return (
    <>
      <article className={LoginCss["login"]}>
        <form onSubmit={handleSubmit} className={FormCss["form"]}>
          <h1 className={FormCss["form__title"]}>
            {/* Send a new verification email */}
            {t("send-new-verify-email")}
          </h1>
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
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            className={FormCss["form__input"]}
            type="email"
            placeholder="Email"
            minLength={5}
            pattern="[\-a-zA-Z0-9~!$%^&amp;*_=+\}\{'?]+(\.[\-a-zA-Z0-9~!$%^&amp;*_=+\}\{'?]+)*@[a-zA-Z0-9_][\-a-zA-Z0-9_]*(\.[\-a-zA-Z0-9_]+)*\.[cC][oO][mM](:[0-9]{1,5})?"
            value={formData.email}
            onChange={handleChange}
          />
          <button className={FormCss["form__button"]} type="submit">
            {t("send")}
          </button>
          {errorMessage && <p className={FormCss["error"]}>{errorMessage}</p>}
          {/* <p>
            Do you want to go back?{" "}
            <Link to="/login">Click here to log in</Link>
          </p> */}
          <p>
            {t("have-account")} <Link to="/login">{t("click-login")}</Link>
          </p>
        </form>
      </article>
    </>
  );
};
