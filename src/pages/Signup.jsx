
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

// ==========================================
// FLASK API URL
// ==========================================
const API_URL = "https://company-management-9w737.faable.link";

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

            console.log("Flask signup response:", response.status, result);

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
        <div className="signup-container">
            <div className="signup-box">

                <h2>Sign Up</h2>

                <form onSubmit={handleSignup}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />

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
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                </form>

                <p>
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Signup; 
