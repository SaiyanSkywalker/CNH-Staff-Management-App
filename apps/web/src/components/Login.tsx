"use client";

import { useState, ChangeEvent, useContext } from "react";
import styles from "../styles/Login.module.css";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Schedule from "./Schedule";
import { BannerContext } from "@webSrc/contexts/BannerContext";
import { LoadingContext } from "@webSrc/contexts/LoadingContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { auth } = useAuth();
  const router = useRouter();
  const bannerContext = useContext(BannerContext);
  const loadingContext = useContext(LoadingContext);

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(false);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(false);
  };

  const submitForm = async () => {
    const isAuthenticated = await auth?.login(username, password, "2");
    if (isAuthenticated) {
      router.replace("/schedule");
    } else {
      setError(true);
      bannerContext?.showBanner(
        "An error has occurred!",
        "other"
      );
    }
    loadingContext?.hideLoader();
  };

  return (
    <>
      {auth?.authenticated ? (
        <Schedule />
      ) : (
        <div className="min-h-screen items-center justify-between p-24">
          <div className="center-container">
            <div className={styles["login-container"]}>
              <h2 className="font-semibold text-center text-3xl p-3">
                Welcome!
              </h2>
              <form>
                <div
                  className={[
                    styles[error ? "error" : ""],
                    styles["inputs-container"],
                  ].join(" ")}
                >
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
        </div>
      )}
    </>
  );
};
export default Login;
