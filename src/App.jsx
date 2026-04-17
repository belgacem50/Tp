import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
// Pages
import Login from "./pages/Login";
import ApiKey from "./pages/ApiKey";
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
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.hasKey ? "/profile" : "/api-key"} />} />
      <Route path="/api-key" element={
        <PrivateRoute>
          {user?.hasKey ? <Navigate to="/profile" replace /> : <ApiKey />}
        </PrivateRoute>
      } />
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/profile" element={user?.hasKey ? <Profile /> : <Navigate to="/api-key" replace />} />
        <Route path="/my-leaves" element={user?.hasKey ? <MyLeaves /> : <Navigate to="/api-key" replace />} />
        <Route path="/new-leave" element={user?.hasKey ? <NewLeave /> : <Navigate to="/api-key" replace />} />
        <Route path="/admin/demands" element={user?.hasKey ? <Demands /> : <Navigate to="/api-key" replace />} />
        <Route path="/admin/users" element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}