import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUpCss from "../styles/SignUp.module.css";
import FormCss from "../styles/Form.module.css";
import ReCAPTCHA from "react-google-recaptcha";
import { API_URL } from "../config/apiConfig";

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
      console.error("Error during registration:", error);
      setErrorMessage("Failed to register. Please try again later.");
    }
  };

  return (
    <>
      <article className={SignUpCss["register"]}>
        <form onSubmit={handleSubmit} className={FormCss["form"]}>
          <h1 className={FormCss["form__title"]}>Register</h1>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            className={FormCss["form__input"]}
            type="text"
            minLength={3}
            placeholder="Username"
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
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            className={FormCss["form__input"]}
            type="password"
            placeholder="Password"
            minLength={6}
            maxLength={20}
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            className={FormCss["form__input"]}
            type="password"
            placeholder="Confirm Password"
            minLength={6}
            maxLength={20}
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
            Send
          </button>
          <p>
            Do you have an account? <Link to="/login">Click here to login</Link>
          </p>
        </form>
      </article>
    </>
  );
}
