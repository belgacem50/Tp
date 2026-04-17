import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function NewLeave() {
  const { user } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState([]); // Liste dynamique m'el Odoo
  const [formData, setFormData] = useState({
    date_from: "",
    date_to: "",
    holiday_status_id: "", 
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  // 1. Njibou el types de congés mel Odoo awel ma t'hal el page
  useEffect(() => {
    const fetchTypes = async () => {
      const apiKey = localStorage.getItem(`apiKey_${user.id}`);
      try {
        const res = await axios.post(`/json/web/dataset/call_kw`, {
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "hr.leave.type",
            method: "search_read",
            args: [[], ["name", "id"]],
            kwargs: {},
            context: { key: apiKey }
          }
        });
        if (res.data.result) {
          setLeaveTypes(res.data.result);
          // N'hatou el awel type par défaut ken l'id fergh
          if (res.data.result.length > 0) {
            setFormData(prev => ({ ...prev, holiday_status_id: res.data.result[0].id }));
          }
        }
      } catch (e) {
        console.error("Erreur lors de la récupération des types de congés");
      }
    };
    fetchTypes();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const apiKey = localStorage.getItem(`apiKey_${user.id}`);
    
    try {
      // 🚀 2. Njibou el employee_id (kima el-3ada)
      const empRes = await axios.post(`/json/web/dataset/call_kw`, {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.employee",
          method: "search_read",
          args: [[["user_id", "=", user.id]], ["id"]],
          kwargs: {},
          context: { key: apiKey }
        }
      });

      const employeeId = empRes.data.result?.[0]?.id;
      if (!employeeId) throw new Error("Aucun employé associé à cet utilisateur.");

      // 🚀 3. Nba'thou el demande
      const res = await axios.post(`/json/web/dataset/call_kw`, {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.leave",
          method: "create",
          args: [{
            employee_id: employeeId,
            holiday_status_id: parseInt(formData.holiday_status_id),
            request_date_from: formData.date_from,
            request_date_to: formData.date_to,
            date_from: `${formData.date_from} 08:00:00`,
            date_to: `${formData.date_to} 17:00:00`,
          }],
          kwargs: {},
          context: { key: apiKey }
        }
      });

      if (res.data.error) {
        setStatus({ type: "error", message: `Odoo: ${res.data.error.data.message || "Erreur"}` });
      } else {
        setStatus({ type: "success", message: "Demande envoyée avec succès !" });
        setFormData({ ...formData, date_from: "", date_to: "" });
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Erreur de connexion." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Nouvelle Demande de Congé</h2>
      
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        {/* Date Début */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>📅 Date de début</label>
          <input type="date" value={formData.date_from} onChange={(e) => setFormData({...formData, date_from: e.target.value})} required 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        </div>

        {/* Date Fin */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>📅 Date de fin</label>
          <input type="date" value={formData.date_to} onChange={(e) => setFormData({...formData, date_to: e.target.value})} required 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        </div>

        {/* Type de congé (Dynamique) */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>🏷️ Type de congé</label>
          <select 
            value={formData.holiday_status_id} 
            onChange={(e) => setFormData({...formData, holiday_status_id: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
          >
            {leaveTypes.length > 0 ? leaveTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            )) : (
              <option>Chargement des types...</option>
            )}
          </select>
        </div>

        {/* Message Status */}
        {status.message && (
          <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', backgroundColor: status.type === "success" ? "#dcfce7" : "#fee2e2", color: status.type === "success" ? "#166534" : "#991b1b" }}>
            {status.message}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {loading ? "Envoi en cours..." : "🚀 Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}