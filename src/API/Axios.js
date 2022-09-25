import axios from "axios";
const token = localStorage.getItem("token");
export const axiosClient = axios.create({
  // baseURL: "http://localhost:9000/api",
  baseURL: "https://order-back-end-61tw.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token?.slice(1, -1)}`,
  },
});
