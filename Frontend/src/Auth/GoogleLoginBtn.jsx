import { GoogleLogin } from "@react-oauth/google";
import api from "./api";
import { useAuth } from "./AuthContext";

export default function GoogleLoginBtn() {
  const { login } = useAuth();

  
  const success = async (res) => {
    const googleToken = res.credential;

    const r = await api.post("/google/", {
      token: googleToken,
    });

    login(r.data.access);
    window.location.href = "/dashboard";
  };

  return <GoogleLogin onSuccess={success} onError={() => alert("Google Failed")} />;
}
