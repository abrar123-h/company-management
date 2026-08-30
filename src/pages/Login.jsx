
 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (response.ok) {

                alert("Login successful!");
                navigate("/welcome");

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

                    {/* Background / Information section */}
                    <div className="cont_info_log_sign_up">

                        <div className="col_md_login">
                            <div className="cont_ba_opcitiy">

                                <h2>Already have an account?</h2>

                                <p>
                                    Sign in to continue to your account.
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

                                <h2>New here?</h2>

                                <p>
                                    Create an account and get started.
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

                    {/* Login form */}
                    <div className="cont_forms cont_forms_active_login">

                        <div className="cont_form_login">

                            <h2>Sign In</h2>

                            <form onSubmit={handleLogin}>

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="submit"
                                    className="btn_login_form"
                                >
                                    Login
                                </button>

                            </form>

                            <button
                                className="switch_button"
                                onClick={() => navigate("/signup")}
                            >
                                Create Account
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;

              
