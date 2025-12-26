import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../Style/login.css";
import { API_BASE_URL } from "../../config/api";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [showForgot, setShowForgot] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);

    const navigate = useNavigate();

    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }

        if (timer === 0) {
            setCanResend(true);
        }
    }, [timer, step]);

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }

        if (!username || !password) {
            toast.error("Please enter both username and password.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.msg || "Invalid login credentials.");
                return;
            }

            if (data.tokens && data.tokens.access && data.tokens.refresh) {
                localStorage.setItem("access_token", data.tokens.access);
                localStorage.setItem("refresh_token", data.tokens.refresh);
            }

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            toast.success("Login successful!");

            if (data.user && data.user.profile_completed) {
                navigate("/Home");
            } else {
                navigate("/Profile_create", { replace: true });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("A server error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const sendOtp = async () => {
        if (!email) {
            toast.error("Please enter your registered email address.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/forgot-password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.msg || "Unable to send OTP.");
                return;
            }

            toast.success("An OTP has been sent to your email.");
            setStep(2);
            setTimer(60);
            setCanResend(false);
        } catch (error) {
            console.error("Send OTP error:", error);
            toast.error("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        if (!otp || !newPassword) {
            toast.error("All fields are required.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/reset-password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otp.trim(),
                    new_password: newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.msg || "Invalid OTP.");
                return;
            }

            toast.success("Your password has been reset successfully.");

            setShowForgot(false);
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
            setTimer(60);
            setCanResend(false);
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !loading) {
            if (!showForgot) {
                handleSubmit(e);
            } else if (step === 1) {
                sendOtp();
            } else {
                resetPassword();
            }
        }
    };

    const handleBackToLogin = () => {
        setShowForgot(false);
        setStep(1);
        setTimer(60);
        setCanResend(false);
        setEmail("");
        setOtp("");
        setNewPassword("");
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>SmartZen</h2>

                {!showForgot && (
                    <>
                        <div className="login-field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>

                        <div style={{ textAlign: "right", marginBottom: "12px" }}>
                            <span
                                style={{
                                    color: "#2a7be4",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                }}
                                onClick={() => setShowForgot(true)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") setShowForgot(true);
                                }}
                            >
                                Forgot password?
                            </span>
                        </div>

                        <button
                            className="login-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                            type="button"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="login-footer">
                            Don't have an account?{" "}
                            <NavLink to="/Signup">Create one</NavLink>
                        </div>
                    </>
                )}

                {showForgot && (
                    <>
                        <h3 style={{ textAlign: "center", color: "#2a7be4" }}>
                            Reset Password
                        </h3>

                        {step === 1 && (
                            <>
                                <div className="login-field">
                                    <label htmlFor="forgot-email">Email</label>
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>

                                <button
                                    className="login-btn"
                                    onClick={sendOtp}
                                    disabled={loading}
                                    type="button"
                                >
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="login-field">
                                    <label htmlFor="otp">OTP</label>
                                    <input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        disabled={loading}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="login-field">
                                    <label htmlFor="new-password">New Password</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        placeholder="Enter new password (min 8 characters)"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>

                                <button
                                    className="login-btn"
                                    onClick={resetPassword}
                                    disabled={loading}
                                    type="button"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>

                                <div style={{ textAlign: "center", marginTop: "10px" }}>
                                    {canResend ? (
                                        <span
                                            style={{
                                                color: "#2a7be4",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontWeight: 600,
                                            }}
                                            onClick={sendOtp}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") sendOtp();
                                            }}
                                        >
                                            Resend OTP
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: "14px", color: "#666" }}>
                                            Resend OTP in {timer}s
                                        </span>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="login-footer">
                            <span
                                style={{ cursor: "pointer", color: "#2a7be4" }}
                                onClick={handleBackToLogin}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") handleBackToLogin();
                                }}
                            >
                                Back to login
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;