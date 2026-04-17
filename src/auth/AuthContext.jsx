import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    try {
      const res = await axios.post(`/json/web/session/authenticate`, {
        jsonrpc: "2.0",
        params: { db: "stage", login: username, password: password }
      });
      
      if (res.data.result && res.data.result.uid) {
        const r = res.data.result;
        const savedKey = localStorage.getItem(`apiKey_${r.uid}`);
        const userData = { 
          id: r.uid, 
          username, 
          name: r.name, 
          role: username === "admin" ? "admin" : "employee", 
          hasKey: !!savedKey 
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  };

 const verifyAndSaveKey = async (key) => {
  try {
    const apiTester = axios.create({ withCredentials: false });

    // 🚀 Njarbu n'a3mlu search_read 3al model 'res.users.apikeys'
    // El model hedha dima requires strict authentication
    const res = await apiTester.post(`/json/web/dataset/call_kw`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        model: "res.users.apikeys",
        method: "search_count",
        args: [[]], 
        kwargs: {
          context: { api_key: key.trim() } 
        }
      }
    });

    console.log("Strict Verification:", res.data);

    // 🔴 1. Ken Odoo rajja' error ya'ni el key ghalta bes-sif
    // Odoo dima i-blocki el models hedhom ken mafammash API key s7iha
    if (res.data.error) {
      return { success: false, error: "Clé API invalide. Vérifiez vos accès Odoo." };
    }

    // 🟢 2. Ken rajja' result (7atta 0), ya'ni Odoo khallak todkhel -> Key S7iha!
    if (res.data.result !== undefined) {
      localStorage.setItem(`apiKey_${user.id}`, key.trim());
      
      const updatedUser = { ...user, hasKey: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return { success: true };
    }

    return { success: false, error: "Validation échouée." };

  } catch (e) {
    return { success: false, error: "Clé incorrecte ou problème serveur." };
  }
};

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyAndSaveKey }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);