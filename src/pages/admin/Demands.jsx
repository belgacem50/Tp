import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function Demands() {
  const { user } = useAuth();
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, confirm, validate, refuse

  const fetchAllDemands = async () => {
    try {
      const apiKey = localStorage.getItem(`apiKey_${user.id}`);
      const res = await axios.post(`/json/web/dataset/call_kw`, {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.leave",
          method: "search_read",
          args: [[], ["employee_id", "holiday_status_id", "date_from", "date_to", "state", "number_of_days"]],
          kwargs: {},
          context: { key: apiKey }
        }
      });
      if (res.data.result) setDemands(res.data.result);
    } catch (err) {
      console.error("Erreur fetching demands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllDemands(); }, []);

  const handleAction = async (leaveId, action) => {
    try {
      const apiKey = localStorage.getItem(`apiKey_${user.id}`);
      const method = action === 'approve' ? 'action_validate' : 'action_refuse';
      await axios.post(`/json/web/dataset/call_kw`, {
        jsonrpc: "2.0",
        method: "call",
        params: { model: "hr.leave", method: method, args: [[leaveId]], kwargs: {}, context: { key: apiKey } }
      });
      fetchAllDemands();
    } catch (err) { alert("Erreur lors de l'action"); }
  };

  // 📈 Calcule des statistiques
  const stats = {
    total: demands.length,
    pending: demands.filter(d => d.state === 'confirm').length,
    approved: demands.filter(d => d.state === 'validate').length,
  };

  const filteredDemands = filter === "all" ? demands : demands.filter(d => d.state === filter);

  if (loading) return <div style={{padding: '20px'}}>Chargement...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{marginBottom: '20px'}}>Dashboard des Congés</h2>

      {/* --- Dashboard Cards --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle('#3b82f6')}><h3>{stats.total}</h3><p>Total Demandes</p></div>
        <div style={cardStyle('#fbbf24')}><h3>{stats.pending}</h3><p>En Attente</p></div>
        <div style={cardStyle('#22c55e')}><h3>{stats.approved}</h3><p>Approuvées</p></div>
      </div>

      {/* --- Filtres --- */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {['all', 'confirm', 'validate', 'refuse'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={btnFilterStyle(filter === f)}>
            {f === 'all' ? 'Tous' : f === 'confirm' ? 'En Attente' : f === 'validate' ? 'Approuvés' : 'Refusés'}
          </button>
        ))}
      </div>

      {/* --- Table (Nafsu el-bera7 m'a filteredDemands) --- */}
      <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflow: 'hidden' }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#1e293b", color: 'white' }}>
            <tr>
              <th style={{ padding: "15px", textAlign: "left" }}>Employé</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Statut</th>
              <th style={{ padding: "15px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDemands.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "15px" }}><b>{d.employee_id[1]}</b></td>
                <td style={{ padding: "15px" }}>{d.state}</td>
                <td style={{ padding: "15px", textAlign: "center" }}>
                  {d.state === 'confirm' && (
                    <div style={{display:'flex', gap:'5px', justifyContent:'center'}}>
                      <button onClick={() => handleAction(d.id, 'approve')} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Approuver</button>
                      <button onClick={() => handleAction(d.id, 'refuse')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Refuser</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles
const cardStyle = (color) => ({ background: color, color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' });
const btnFilterStyle = (active) => ({ padding: '8px 15px', borderRadius: '20px', border: '1px solid #3b82f6', background: active ? '#3b82f6' : 'white', color: active ? 'white' : '#3b82f6', cursor: 'pointer' });