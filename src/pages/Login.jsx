import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Backend URL - will use production or local based on environment
const API_URL = import.meta.env.MODE === 'production' 
    ? "https://company-management-9w737.faable.link"
    : "http://localhost:8000";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Login successful");

                localStorage.setItem(
                    "user_id",
                    String(result.user_id || "")
                );

                localStorage.setItem(
                    "user_name",
                    result.name || ""
                );

                localStorage.setItem(
                    "logged_in",
                    "true"
                );

                navigate("/welcome");
            } else {
                alert(
                    result.message ||
                    result.error ||
                    "Login failed"
                );
            }

        } catch (error) {
            console.error("Login error:", error);

            alert(
                "Cannot connect to server. Make sure backend is running at: " + API_URL
            );
        }
    };

    return (
        <div className="cotn_principal">

            <div className="cont_centrar">

                <div className="cont_login">

                    {/* Background information */}
                    <div className="cont_info_log_sign_up">

                        <div className="col_md_login">

                            <div className="cont_ba_opcitiy">

                                <h2>LOGIN</h2>

                                <p>
                                    Already have an account?
                                </p>

                                <button
                                    className="btn_login"
                                    type="button"
                                >
                                    LOGIN
                                </button>

                            </div>

                        </div>


                        <div className="col_md_sign_up">

                            <div className="cont_ba_opcitiy">

                                <h2>SIGN UP</h2>

                                <p>
                                    Don't have an account?
                                </p>

                                <button
                                    className="btn_sign_up"
                                    type="button"
                                    onClick={() => navigate("/signup")}
                                >
                                    SIGN UP
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* Login form */}
                    <div className="cont_forms">

                        <div className="cont_form_login">

                            <h2>Login</h2>

                            <form onSubmit={handleLogin}>

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                />

                                <button
                                    className="btn_login_form"
                                    type="submit"
                                >
                                    LOGIN
                                </button>

                            </form>

                            <button
                                className="switch_button"
                                type="button"
                                onClick={() => navigate("/signup")}
                            >
                                Create an account
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
