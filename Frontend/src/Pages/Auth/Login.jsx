import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../Style/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);

      const res = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/Dashboard";
      } else {
        alert(data.msg || "Invalid credentials");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>SmartZen</h2>
        <p className="login-subtitle">Welcome back 👋</p>

        <div className="login-field">
          <label>Username</label>
          <input type="text" />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input type="password" />
        </div>

        <button className="login-btn">Login</button>

        <div className="login-footer">
          Don't have an account? <a href="/Signup">Sign up</a>
        </div>
      </div>
    </div>
  );

};

export default Login;
