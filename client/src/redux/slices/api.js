import axios from "axios";

export const api = axios.create({
  // baseURL: `http://localhost:5001/api`, 
  baseURL: `/api`, 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// export const host = "http://localhost:5555";
export const host = "https://maxifyacademy.com/";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
