"use client";
import { useState, ChangeEvent } from "react";
import styles from "../../styles/Login.module.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const submitForm = () => {
    // Perform validation and authentication logic here
    if (username === "example" && password === "password") {
      alert("Login successful!");
      // Redirect or perform other actions after successful login
      router.replace("/upload");
    } else {
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className={styles["center-container"]}>
      <div className={`${styles["login-container"]}`}>
        <h2 className={`font-semibold text-center text-3xl p-3`}>Welcome!</h2>
        <form>
          <div className={styles["inputs-container"]}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              onChange={onUsernameChange}
              name="username"
              placeholder="username"
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              onChange={onPasswordChange}
              name="password"
              placeholder="password"
              required
            />
          </div>

          <button
            className={styles["btn-login"]}
            type="button"
            onClick={submitForm}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
