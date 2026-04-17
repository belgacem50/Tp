import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function Users() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 State lel recherche

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const apiKey = localStorage.getItem(`apiKey_${user.id}`);
        
        const res = await axios.post(`/json/web/dataset/call_kw`, {
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "hr.employee",
            method: "search_read",
            // Njibou el data el lazma kima tfahemna
            args: [[], ["name", "work_email", "department_id", "job_id", "work_phone"]],
            kwargs: {},
            context: { key: apiKey }
          }
        });

        if (res.data.result) {
          setEmployees(res.data.result);
        } else {
          setError("Erreur lors de la récupération des employés.");
        }
      } catch (err) {
        setError("Erreur de connexion avec le serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user.id]);

  // Logic mta' el filtrage
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.work_email && emp.work_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div style={{padding: '20px'}}>Chargement de la liste...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#1e293b", marginBottom: "10px" }}>👥 Liste des Employés</h2>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Gérez et consultez les informations de vos collaborateurs.</p>
      </div>

      {/* 🔍 Barre de Recherche */}
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="🔍 Rechercher par nom ou email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%', 
            padding: '15px 20px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            outline: 'none',
            transition: 'border 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        {searchTerm && (
          <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            {filteredEmployees.length} résultat(s)
          </span>
        )}
      </div>

      {error && (
        <div style={{ padding: '15px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* 🗂️ Grid des Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '25px' 
      }}>
        {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
          <div key={emp.id} style={{ 
            background: 'white', 
            padding: '25px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9',
            transition: 'transform 0.2s',
            cursor: 'default'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ 
                width: '55px', height: '55px', borderRadius: '12px', 
                background: '#eff6ff', color: '#3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 'bold'
              }}>
                {emp.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#1e293b' }}>{emp.name}</h3>
                <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', textTransform: 'uppercase' }}>
                  {emp.job_id ? emp.job_id[1] : 'Poste non défini'}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>
                📧 <span style={{ color: '#334155' }}>{emp.work_email || '---'}</span>
              </p>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>
                📞 <span style={{ color: '#334155' }}>{emp.work_phone || '---'}</span>
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                🏢 <span style={{ color: '#334155', fontWeight: '500' }}>{emp.department_id ? emp.department_id[1] : 'N/A'}</span>
              </p>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px', color: '#94a3b8' }}>
            <p style={{ fontSize: '18px' }}>🚫 Aucun employé ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}