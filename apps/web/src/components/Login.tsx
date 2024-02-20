import { useState, ChangeEvent } from "react";
import styles from "../styles/Login.module.css";
import { useAuth } from "@webSrc/context/Auth";
import { useRouter } from "next/navigation";
import Schedule from "./Schedule";
import Page from "@webSrc/app/page";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { auth } = useAuth();
  const router = useRouter();

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(false);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(false);
  };

  const submitForm = () => {
    if (auth?.login(username, password)) {
      router.replace("/schedule");
      alert("Login successful!");
    } else {
      setError(true);
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <>
      {auth?.authenticated ? (
        <Schedule />
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className={styles["center-container"]}>
          <div className={`${styles["login-container"]}`}>
            <h2 className={`font-semibold text-center text-3xl p-3`}>Welcome!</h2>
            <form>
              <div className={[styles[error ? "error" : ""], styles["inputs-container"]].join(" ")}>
                <label htmlFor="username">Username:</label>
                <input
                type="username"
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
      </main>
      )}
    </>
  );
}
export default Login;
