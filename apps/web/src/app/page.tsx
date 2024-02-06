"use client"
import { useRef, useState } from 'react'

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const submitForm = () => {
        // Perform validation and authentication logic here
        if (username === 'example' && password === 'password') {
            alert('Login successful!');
            // Redirect or perform other actions after successful login
        }
        else {
            alert('Invalid username or password. Please try again.');
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <div className="login-container">
                    <h2 className="home-header">Welcome!</h2>
                    <form>
                        <div className="inputs-container">
                            <label htmlFor="username">
                                Username:
                            <input type="text" onChange={onUsernameChange} placeholder="username" required />
                            </label>

                            <label htmlFor="password">
                                Password:
                            <input type="password" onChange={onPasswordChange} placeholder="password" required />
                            </label>
                        </div>
                        <button type="button" onClick={submitForm}>Login</button>
                    </form>
                </div>
            </div>
        </main>
    )
}
