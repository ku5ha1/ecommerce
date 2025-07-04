import axios from "axios"
import Header from "../components/Header"

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json', 
  },
});

export default api