import { useState } from "react";
import api from "../../Auth/api";
import { useAuth } from "../../Auth/AuthContext";
import GoogleLoginBtn from "../../Auth/GoogleLoginBtn";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.post("/token/", {
      username: email,
      password,
    });

    login(res.data.access);
    window.location.href = "/Dashboard";
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={submit}>Login</button>

      <hr />
      <GoogleLoginBtn />
    </div>
  );
}
