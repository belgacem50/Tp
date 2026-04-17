import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(username, password);
  
  if (result && result.success) {
    if (result.hasKey) {
      navigate(username === "admin" ? "/admin/demands" : "/profile");
    } else {
      navigate("/api-key"); // 👈 Forcé yemchi hna
    }
  } else {
    setError("Compte ghalet");
  }
};

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Gestion Congés</h2>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '20px'}}>Connexion</p>

        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label>Utilisateur</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}