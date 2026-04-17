import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function MyLeaves() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const apiKey = localStorage.getItem(`apiKey_${user.id}`);

        // 🚀 1. Njibou el employee_id kima 3malna fil NewLeave
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

        if (!employeeId) {
          setError("Impossible de trouver votre fiche employé.");
          setLoading(false);
          return;
        }

        // 🚀 2. Njibou el liste mta' el congés mta' el employee hedha
        const res = await axios.post(`/json/web/dataset/call_kw`, {
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "hr.leave",
            method: "search_read",
            args: [[["employee_id", "=", employeeId]], ["holiday_status_id", "date_from", "date_to", "state", "number_of_days"]],
            kwargs: {},
            context: { key: apiKey }
          }
        });

        if (res.data.result) {
          // Nratbouhom mel jdid lel qdim
          const sortedLeaves = res.data.result.sort((a, b) => b.id - a.id);
          setLeaves(sortedLeaves);
        } else {
          setError("Erreur lors de la récupération des données.");
        }
      } catch (err) {
        setError("Erreur de connexion avec Odoo.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [user.id]);

  // 🎨 Function bech tlawen el statut kima Odoo
  const getStatusStyle = (state) => {
    switch (state) {
      case 'validate': return { color: '#166534', bg: '#dcfce7', label: 'Approuvé' };
      case 'confirm': return { color: '#854d0e', bg: '#fef9c3', label: 'En attente' };
      case 'refuse': return { color: '#991b1b', bg: '#fee2e2', label: 'Refusé' };
      case 'draft': return { color: '#475569', bg: '#f1f5f9', label: 'Brouillon' };
      default: return { color: '#64748b', bg: '#f1f5f9', label: state };
    }
  };

  if (loading) return <div style={{padding: '20px'}}>Chargement de vos demandes...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Mes Demandes de Congés</h2>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '10px', background: '#fee2e2', padding: '10px', borderRadius: '5px' }}>{error}</div>}

      <div style={{ overflowX: "auto", background: "white", borderRadius: "10px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <tr>
              <th style={{ padding: "15px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Période</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Jours</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? leaves.map((leave) => {
              const status = getStatusStyle(leave.state);
              return (
                <tr key={leave.id} style={{ borderBottom: "1px solid #edf2f7" }}>
                  <td style={{ padding: "15px", fontWeight: "500" }}>{leave.holiday_status_id[1]}</td>
                  <td style={{ padding: "15px", fontSize: "14px" }}>
                    Du <b>{new Date(leave.date_from).toLocaleDateString()}</b> <br/>
                    Au <b>{new Date(leave.date_to).toLocaleDateString()}</b>
                  </td>
                  <td style={{ padding: "15px" }}>{leave.number_of_days} j</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ 
                      padding: "6px 12px", 
                      borderRadius: "20px", 
                      fontSize: "12px", 
                      fontWeight: "bold", 
                      backgroundColor: status.bg, 
                      color: status.color 
                    }}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                  Aucune demande de congé trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}