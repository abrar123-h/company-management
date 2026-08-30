

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {

                alert("Account created successfully!");
                navigate("/login");

            } else {

                alert(result.message || result.error);
            }

        } catch (error) {

            console.error(error);
            alert("Cannot connect to Flask server");
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

                                <h2>Already have an account?</h2>

                                <p>
                                    Sign in to continue.
                                </p>

                                <button
                                    className="btn_login"
                                    onClick={() => navigate("/login")}
                                >
                                    LOGIN
                                </button>

                            </div>
                        </div>

                        <div className="col_md_sign_up">
                            <div className="cont_ba_opcitiy">

                                <h2>Create Account</h2>

                                <p>
                                    Register your new account.
                                </p>

                                <button
                                    className="btn_sign_up"
                                    onClick={() => navigate("/signup")}
                                >
                                    SIGN UP
                                </button>

                            </div>
                        </div>

                    </div>

                    {/* Signup form */}

                    <div className="cont_forms cont_forms_active_sign_up">

                        <div className="cont_form_sign_up">

                            <h2>Create Account</h2>

                            <form onSubmit={handleSignup}>

                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="submit"
                                    className="btn_sign_up_form"
                                >
                                    Sign Up
                                </button>

                            </form>

                            <button
                                className="switch_button"
                                onClick={() => navigate("/login")}
                            >
                                Already have an account? Sign In
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Signup;

