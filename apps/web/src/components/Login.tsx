"use client";

import { useState, ChangeEvent } from "react";
import styles from "../styles/Login.module.css";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Schedule from "./Schedule";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("2");
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

  const onRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(`e.target.value is ${e.target.value}`);
    setRole(e.target.value);
    setError(false);
  }

  const submitForm = async () => {
    const isAuthenticated = await auth?.login(username, password, role);
    if (isAuthenticated) {
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
                  <div>
                  <label htmlFor="role">Role:</label>
                  <select required id="role" defaultValue={"2"} onChange={onRoleChange}>
                    <option value="2">Admin</option>
                    <option value="3">Nurse Manager</option>
                  </select>
                  </div>
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
