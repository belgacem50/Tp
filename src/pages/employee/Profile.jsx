import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [empData, setEmpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetailedProfile = async () => {
      try {
        const apiKey = localStorage.getItem(`apiKey_${user.id}`);
        
        // 🚀 Njibou el data mel hr.employee b'el user_id
        const res = await axios.post(`/json/web/dataset/call_kw`, {
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "hr.employee",
            method: "search_read",
            args: [[["user_id", "=", user.id]], ["id", "name", "work_phone", "work_email", "department_id", "job_id"]],
            kwargs: {},
            context: { key: apiKey }
          }
        });

        if (res.data.result && res.data.result.length > 0) {
          setEmpData(res.data.result[0]);
        } else {
          setError("Fiche employé introuvable dans Odoo.");
        }
      } catch (err) {
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedProfile();
  }, [user.id]);

  if (loading) return <div style={{ padding: '20px' }}>Chargement du profil...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h2 style={{ marginBottom: "25px", color: "#1e293b" }}>Mon Profil Professionnel</h2>

      {error && (
        <div style={{ padding: '15px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {empData && (
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '15px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            {/* Nom & Job */}
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Nom Complet</label>
              <p style={{ fontSize: '18px', margin: '5px 0 20px 0', color: '#0f172a', fontWeight: '600' }}>{empData.name}</p>

              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Poste (Job)</label>
              <p style={{ fontSize: '16px', margin: '5px 0 20px 0', color: '#3b82f6' }}>{empData.job_id ? empData.job_id[1] : 'Non défini'}</p>
            </div>

            {/* Contact & Dept */}
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Département</label>
              <p style={{ fontSize: '16px', margin: '5px 0 20px 0', color: '#0f172a' }}>{empData.department_id ? empData.department_id[1] : 'Direction'}</p>

              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Téléphone</label>
              <p style={{ fontSize: '16px', margin: '5px 0 20px 0', color: '#0f172a' }}>{empData.work_phone || 'Non renseigné'}</p>
            </div>

          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Email Professionnel</label>
            <p style={{ fontSize: '16px', margin: '5px 0 0 0', color: '#0f172a' }}>{empData.work_email || 'Pas d\'email'}</p>
          </div>

          <div style={{ 
            marginTop: '30px', 
            padding: '12px', 
            background: '#f0fdf4', 
            color: '#166534', 
            borderRadius: '8px', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            ✅ Données synchronisées en temps réel avec Odoo
          </div>
        </div>
      )}
    </div>
  );
}