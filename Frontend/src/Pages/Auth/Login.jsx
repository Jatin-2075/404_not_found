import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../Style/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");     
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);   // ✅ added

  const navigate = useNavigate();                  // ✅ added

  const handleSubmit = async () => {
    if (!username || !password) {
      alert("All fields required");
      return;
    }

    setLoading(true);                               // ✅ added

    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);

      const res = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        body: form,
        credentials: "include", // ✅ required for Django session auth
      });

      const data = await res.json();

      if (data.success) {
        navigate("/Dashboard", { replace: true });  // ✅ SPA-safe redirect
      } else {
        alert(data.msg || "Invalid credentials");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);                            // ✅ added
    }
  };


  return (
    <div className="login-container">
      <h2>SmartZen</h2>

      <div className="login-field">
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="login-field">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        className="login-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="login-footer">
        Don't have an account?{" "}
        <NavLink to="/Signup">Create one</NavLink>
      </div>
    </div>
  );
};

export default Login;
