import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    borderRadius: '8px',
    background: location.pathname === path ? '#3b82f6' : 'transparent',
    marginBottom: '8px',
    transition: '0.3s',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* --- Sidebar (Men ghir bouton deconnexion louta) --- */}
      <nav style={{ 
        width: '260px', 
        background: '#0f172a', 
        color: 'white', 
        padding: '25px 20px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '22px', color: '#60a5fa', margin: 0 }}>HR Portal</h2>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '5px' }}>
            MODE: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{user?.role?.toUpperCase()}</span>
          </div>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          <li><Link to="/profile" style={linkStyle('/profile')}>👤 Mon Profil</Link></li>
          <div style={{ margin: '20px 0', borderTop: '1px solid #1e293b' }}></div>

          {user?.role === 'admin' ? (
            <>
              <li style={{ color: '#475569', fontSize: '11px', marginBottom: '15px' }}>ADMINISTRATION</li>
              <li><Link to="/admin/demands" style={linkStyle('/admin/demands')}>📋 Gestion Demandes</Link></li>
              <li><Link to="/admin/users" style={linkStyle('/admin/users')}>👥 Liste Employés</Link></li>
            </>
          ) : (
            <>
              <li style={{ color: '#475569', fontSize: '11px', marginBottom: '15px' }}>ESPACE EMPLOYÉ</li>
              <li><Link to="/my-leaves" style={linkStyle('/my-leaves')}>📅 Mes Congés</Link></li>
              <li><Link to="/new-leave" style={linkStyle('/new-leave')}>➕ Nouvelle Demande</Link></li>
            </>
          )}
        </ul>
      </nav>

      {/* --- Main Content Area --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* --- 🚀 Top Header (Win badalna el Deconnexion) --- */}
        <header style={{ 
          height: '70px', 
          background: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', // Yjib el contenu 3al limin
          padding: '0 30px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <button 
            onClick={logout} 
            style={{
              background: '#fee2e2', 
              color: '#dc2626', 
              border: '1px solid #fecaca', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.target.style.background = '#fecaca'}
            onMouseOut={(e) => e.target.style.background = '#fee2e2'}
          >
            🚪 Déconnexion
          </button>
        </header>

        {/* Content Section */}
        <main style={{ flex: 1, background: '#f8fafc', padding: '40px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}