import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Style/index.css'
import App from './App.jsx'
import { AuthProvider } from './Auth/AuthContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='581363368131-t1pt9mkp31imk8uhvtg3gdr1vn03kavp.apps.googleusercontent.com' >
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>
</GoogleOAuthProvider>
)