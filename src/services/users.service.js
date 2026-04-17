import { useState, useEffect } from "react";
import { odooRequest } from "./odoo";
import { useAuth } from "../auth/AuthContext";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const { apiKey } = useAuth();

  useEffect(() => {
    if (apiKey) {
      odooRequest("hr.employee", "search_read", {
        fields: ["id", "name", "work_email", "job_id", "image_1920"]
      }, apiKey).then(res => {
        setUsers(res.map(u => ({
          id: u.id,
          name: u.name,
          email: u.work_email,
          role: u.job_id ? u.job_id[1] : "Employee",
          photo: u.image_1920 ? `data:image/png;base64,${u.image_1920}` : "https://randomuser.me/api/portraits/lego/2.jpg"
        })));
      });
    }
  }, [apiKey]);

  return { users };
}