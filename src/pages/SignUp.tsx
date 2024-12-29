import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUpCss from "../styles/SignUp.module.css";
import FormCss from "../styles/Form.module.css";
import ReCAPTCHA from "react-google-recaptcha";
import { API_URL } from "../config/apiConfig";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!captchaValue) {
      setErrorMessage("Please complete the CAPTCHA");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMessage(data.error || "An error occurred");
      }
    } catch (error) {
      // console.error("Error during registration:", error);
      setErrorMessage("Failed to register. Please try again later.");
    }
  };

  return (
    <>
      <article className={SignUpCss["register"]}>
        <form onSubmit={handleSubmit} className={FormCss["form"]}>
          <h1 className={FormCss["form__title"]}>{t("register")}</h1>
          <label htmlFor="username">{t("username")}</label>
          <input
            id="username"
            name="username"
            className={FormCss["form__input"]}
            type="text"
            minLength={3}
            placeholder={t("username-placeholder")}
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

          <label htmlFor="password">{t("password")}</label>
          <input
            id="password"
            name="password"
            className={FormCss["form__input"]}
            type="password"
            placeholder={t("password-placeholder")}
            minLength={6}
            maxLength={64}
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="confirm-password">{t("password-confirm")}</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            className={FormCss["form__input"]}
            type="password"
            placeholder={t("password-placeholder")}
            minLength={6}
            maxLength={64}
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <ReCAPTCHA
            className={FormCss["g-recaptcha"]}
            sitekey="6LeI644qAAAAAIs0jtKxxo8XjGliw24uQq9WULlt"
            onChange={handleCaptchaChange}
            theme="dark"
          />

          {errorMessage && (
            <p className={FormCss["error-message"]}>{errorMessage}</p>
          )}

          <button className={FormCss["form__button"]} type="submit">
            {t("send")}
          </button>
          <p>
            {t("have-account")} <Link to="/login">{t("click-login")}</Link>
          </p>
        </form>
      </article>
    </>
  );
}
