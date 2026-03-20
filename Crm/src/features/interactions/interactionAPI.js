import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const sendMessage = async (query) => {
  return axios.post(`${API}/chat`, { query });
};