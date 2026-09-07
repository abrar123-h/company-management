
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

// ==========================================
// LOCAL FLASK API URL
// ==========================================
const API_URL = "http://127.0.0.1:8000";

function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            alert("Please fill all required fields");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password: password
                })
            });

            const text = await response.text();

            let result;

            try {
                result = JSON.parse(text);
            } catch {
                result = {
                    message: text || "Invalid response from Flask server"
                };
            }

            console.log(
                "Flask signup response:",
                response.status,
                result
            );

            if (response.ok) {
                alert(result.message || "Signup successful");

                setUsername("");
                setEmail("");
                setPassword("");

                navigate("/");
            } else {
                alert(
                    result.message ||
                    result.error ||
                    "Signup failed"
                );
            }

        } catch (error) {
            console.error("Signup error:", error);

            alert("Cannot connect to Flask server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cotn_principal">

            <div className="cont_centrar">

                <div className="cont_login">

                    {/* Background information */}
                    <div className="cont_info_log_sign_up">

                        {/* Login side */}
                        <div className="col_md_login">

                            <div className="cont_ba_opcitiy">

                                <h2>LOGIN</h2>

                                <p>
                                    Already have an account?
                                </p>

                                <button
                                    className="btn_login"
                                    type="button"
                                    onClick={() => navigate("/")}
                                >
                                    LOGIN
                                </button>

                            </div>

                        </div>

                        {/* Signup side */}
                        <div className="col_md_sign_up">

                            <div className="cont_ba_opcitiy">

                                <h2>SIGN UP</h2>

                                <p>
                                    Create your account
                                </p>

                                <button
                                    className="btn_sign_up"
                                    type="button"
                                >
                                    SIGN UP
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* Signup form */}
                    <div className="cont_forms">

                        <div className="cont_form_sign_up">

                            <h2>Sign Up</h2>

                            <form onSubmit={handleSignup}>

                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    disabled={loading}
                                    autoComplete="username"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    disabled={loading}
                                    autoComplete="email"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={loading}
                                    autoComplete="new-password"
                                />

                                <button
                                    className="btn_sign_up_form"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating Account..."
                                        : "SIGN UP"}
                                </button>

                            </form>

                            <button
                                className="switch_button"
                                type="button"
                                onClick={() => navigate("/")}
                            >
                                Already have an account? Login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Signup;

