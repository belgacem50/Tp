import axios from "axios";
const ODOO_URL = "http://localhost:8069";
const DB_NAME = "stage";

export const odooRequest = async (model, method, params, apiKey) => {
  try {
    const response = await axios.post(`${ODOO_URL}/json/${DB_NAME}/${model}/${method}`, params, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "X-Odoo-Database": DB_NAME
      }
    });
    return response.data;
  } catch (error) {
    console.error("Odoo API Error:", error);
    throw error;
  }
};