import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ApiKey() {
  // 1️⃣ Thabbet hna: lezem ismou keyInput
  const [keyInput, setKeyInput] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { verifyAndSaveKey, user } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // 🔴 1. Thabit logic mel loul qbal ma nkalmou Odoo
  // Ken el key mte3ek maktouba ay kléma sghira (ghalta), wa9afha hna
  if (keyInput.length < 20) { 
    setError("La clé API semble trop courte ou invalide.");
    setLoading(false);
    return;
  }

  const result = await verifyAndSaveKey(keyInput);

  if (result.success) {
    navigate(user.role === "admin" ? "/admin/demands" : "/profile");
  } else {
    setError(result.error);
    setLoading(false);
  }
};

  return (
    <div className="api-page">
  <div className="api-card">

        <h2 style={{ marginBottom: '10px' }}>Clé API Odoo</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
          Veuillez saisir votre clé API personnelle pour activer la synchronisation.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Votre Clé API</label>
            <input
  type="password"
  className="api-input"
  value={keyInput}
  onChange={(e) => setKeyInput(e.target.value)}
  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  required
/>

          </div>

          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="api-btn">
  {loading ? "Vérification..." : "Vérifier et Enregistrer"}
</button>

        </form>
      </div>
    </div>
  );
}