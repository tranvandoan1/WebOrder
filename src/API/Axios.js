import axios from "axios";
const token = localStorage.getItem("token");
export const axiosClient = axios.create({
  baseURL: "http://localhost:9000/api",
  // baseURL: "https://back-end-order.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token?.slice(1, -1)}`,
  },
});
