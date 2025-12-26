import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../Style/signup.css";
import { API_BASE_URL } from "../../config/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      toast.error(
        "Username must be 3-20 characters long, start with a letter, and contain only letters, numbers, or underscores."
      );
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const signupRes = await fetch(`${API_BASE_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername,
          email: trimmedEmail,
          password,
        }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok || !signupData.success) {
        toast.error(signupData.msg || "Signup failed.");
        return;
      }

      const loginRes = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername,
          password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.success) {
        toast.error("Signup successful, but login failed. Please login manually.");
        navigate("/Login");
        return;
      }

      if (loginData.tokens && loginData.tokens.access && loginData.tokens.refresh) {
        localStorage.setItem("access_token", loginData.tokens.access);
        localStorage.setItem("refresh_token", loginData.tokens.refresh);
      }

      if (loginData.user) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      toast.success("Account created successfully!");

      if (loginData.user && loginData.user.profile_completed) {
        navigate("/Home");
      } else {
        navigate("/Profile_create", { replace: true });
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>SmartZen</h2>

        <div className="signup-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div className="signup-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div className="signup-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <div className="signup-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <button
          className="signup-btn"
          onClick={handleSubmit}
          disabled={loading}
          type="button"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="signup-login-text">
          Already have an account? <NavLink to="/Login">Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;