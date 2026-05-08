import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

// Pages
import Login from "./pages/Login";
import Profile from "./pages/employee/Profile";
import MyLeaves from "./pages/employee/MyLeaves"; 
import NewLeave from "./pages/employee/NewLeave";
import Demands from "./pages/admin/Demands";
import Users from "./pages/admin/Users";

// Components
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/profile" />} 
      />

      {/* Protected Routes */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-leaves" element={<MyLeaves />} />
        <Route path="/new-leave" element={<NewLeave />} />
        <Route path="/admin/demands" element={<Demands />} />
        <Route path="/admin/users" element={<Users />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} />} />
    </Routes>
  );
}