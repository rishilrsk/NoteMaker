import axios from "axios";

// Get API URL from environment variables (set by Vite)
// Fallback for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: "https://notemaker-api.onrender.com/api", // <-- USE YOUR RENDER URL HERE
});

/**
 * Axios Request Interceptor
 * * This function runs before every single request.
 * It checks if we have a token in localStorage.
 * If we do, it adds it to the 'x-auth-token' header.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("notemaker-token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Service ---
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const getAuthUser = () => api.get("/auth");

// --- Notes Service ---
export const getNotes = () => api.get("/notes");

export const getNoteById = (id) => api.get(`/notes/${id}`);

export const createNote = (noteData) => api.post("/notes", noteData);

export const updateNote = (id, noteData) => api.put(`/notes/${id}`, noteData);

export const deleteNote = (id) => api.delete(`/notes/${id}`);

export const duplicateNote = (id) => api.post(`/notes/${id}/duplicate`);

export const getNoteVersions = (id) => api.get(`/notes/${id}/versions`);

export const restoreNoteVersion = (id, versionId) =>
  api.post(`/notes/${id}/versions/${versionId}/restore`);

export const summarizeNote = (id, text) =>
  api.post(`/notes/${id}/summarize`, { text });

export default api;
