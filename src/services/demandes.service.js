import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

export function useDemandes() {
  const [list, setList] = useState([]);
  const { user } = useAuth();

  const fetchLeaves = async () => {
    if (!user || !user.hasKey) return;
    try {
      const res = await axios.post(`/json/web/dataset/call_kw`, {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.leave",
          method: "search_read",
          args: [[["user_id", "=", user.id]], ["date_from", "date_to", "holiday_status_id", "state"]],
          kwargs: {}
        }
      });
      if (res.data.result) setList(res.data.result);
    } catch (e) { console.error(e); }
  };

  const add = async (formData) => {
    if (!user) return false;
    try {
      // ✅ URL  mta3 Odoo bech ya3mel Create
      const res = await axios.post(`/json/web/dataset/call_kw`, {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.leave",
          method: "create",
          args: [{
            name: "Demande via React",
            date_from: `${formData.startDate} 08:00:00`,
            date_to: `${formData.endDate} 18:00:00`,
            holiday_status_id: parseInt(formData.type) || 1,
            employee_id: 1, 
            holiday_type: 'employee'
          }],
          kwargs: {}
        }
      });

      if (res.data.result) {
        await fetchLeaves();
        return true;
      }
      return false;
    } catch (err) { return false; }
  };

  useEffect(() => { fetchLeaves(); }, [user]);
  return { list, add };
}