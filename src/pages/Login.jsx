import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// ==========================================
// FLASK API URL
// ==========================================
const API_URL = "https://company-management-9w737.faable.link";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        setLoading(true);

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

            const text = await response.text();

            let result;

            try {
                result = JSON.parse(text);
            } catch {
                result = {
                    message: text || "Invalid response from Flask server"
                };
            }

            console.log("Flask response:", response.status, result);

            if (response.ok) {
                // Save login information
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

                alert(result.message || "Login successful");

                navigate("/welcome");
            } else {
                alert(
                    result.message ||
                    result.error ||
                    "Login failed"
                );
            }

        } catch (error) {
            console.error("FLASK CONNECTION ERROR:", error);

            alert(
                "Cannot connect to Flask server.\n\n" +
                "Please make sure the Flask backend is deployed and running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h2>Login</h2>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Connecting..." : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;


