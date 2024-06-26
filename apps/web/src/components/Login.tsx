/**
 * File: Login.tsx
 * Purpose: Component used to sign users into application
 */
"use client";

import { useState, ChangeEvent, useContext, useEffect } from "react";
import styles from "../styles/Login.module.css";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BannerContext } from "@webSrc/contexts/BannerContext";
import { LoadingContext } from "@webSrc/contexts/LoadingContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const { auth } = useAuth();
  const router = useRouter();
  const bannerContext = useContext(BannerContext);
  const loadingContext = useContext(LoadingContext);

  // Event handlers for changing input fields
  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(false);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(false);
  };

  const onRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(`e.target.value is ${e.target.value}`);
    setRole(e.target.value);
    setError(false);
  };

  /**
   * Handles user sending login info to server
   * On success, Redirects user 
   * on error, shows banner
   */
  const submitForm = async () => {
    try {
      loadingContext?.showLoader();
      const isAuthenticated = await auth?.login(username, password, role);
      if (isAuthenticated) {
        router.replace("/schedule");
      } else {
        setError(true);
        bannerContext?.showBanner(`Unable to log in user ${username}`, "error");
      }
      loadingContext?.hideLoader();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setError(false);
    setIsButtonDisabled(!username || !password || !role);
  }, [username, password, role]);
  return (
    <>
      <div className="min-h-screen items-center justify-between p-24">
        <div className="center-container">
          <div className={styles["login-container"]}>
            <h2 className="font-semibold text-center text-3xl p-3">Welcome!</h2>
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
                  placeholder="Enter your username"
                  required
                />

                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  onChange={onPasswordChange}
                  name="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="mb-10">
                <div className="mb-5">
                  <label className="block py-2.5" htmlFor="role">
                    Role:
                  </label>
                  <select
                    required
                    id="role"
                    className={`${styles["role-select"]}`}
                    defaultValue={""}
                    onChange={onRoleChange}
                  >
                    <option className={`ms-2`} value="">
                      Select a role
                    </option>
                    <option className={`ms-2`} value="2">
                      Admin
                    </option>
                    <option className={`ms-2`} value="3">
                      Nurse Manager
                    </option>
                  </select>
                </div>
                <button
                  className={`${
                    isButtonDisabled
                      ? `${styles["btn-login-disabled"]}`
                      : `${styles["btn-login-enabled"]}`
                  } ${styles["btn-login"]}`}
                  type="button"
                  onClick={submitForm}
                  disabled={isButtonDisabled}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
