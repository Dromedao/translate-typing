import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginCss from "../styles/Login.module.css";
import FormCss from "../styles/Form.module.css";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
        credentials: "include"
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorText = errorData?.error || "Invalid credentials";
        throw new Error(errorText);
      }
        navigate("/"); 
    } catch (error) {
      setErrorMessage("Failed to login. Please try again later.");
    }
  };

  return (
    <>
      <article className={LoginCss["login"]}>
        <form onSubmit={handleSubmit} className={FormCss["form"]}>
          <h1 className={FormCss["form__title"]}>Login</h1>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            placeholder="Enter your username..."
            className={FormCss["form__input"]}
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            placeholder="Enter your password..."
            className={FormCss["form__input"]}
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className={FormCss["form__button"]} type="submit">
            Send
          </button>
          {errorMessage && <p className={FormCss["error"]}>{errorMessage}</p>}
          <p>
            Don't have an account?{" "}
            <Link to="/sign-up">Click here to sign up</Link>
          </p>
        </form>
      </article>
    </>
  );
}
