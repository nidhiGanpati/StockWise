// frontend/src/services/authService.js
import axios from "axios";
import { registerMock, loginMock, logoutMock, ensureDefaultUser } from "./mockAuth";

// API URL - Ensure this is correctly pointing to your backend
const API_URL = "http://localhost:3000";

// --- Auth mode ---
// For class/demo submissions you can disable the backend and run auth fully in the browser.
// Vite exposes env vars via import.meta.env (not process.env)
// Set VITE_AUTH_MODE=api to use backend.
const AUTH_MODE = (import.meta.env.VITE_AUTH_MODE || "mock").toLowerCase();
const USE_API = AUTH_MODE === "api";

// Ensure the default mock user exists as soon as the service loads.
// (No-op for API mode.)
if (!USE_API) {
  try {
    ensureDefaultUser();
  } catch (e) {
    // ignore storage issues
  }
}

// --- Axios Default Header Setup ---
const setAuthToken = (token) => {
	if (token) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		console.log("Axios header set with token.");
	} else {
		delete axios.defaults.headers.common["Authorization"];
		console.log("Axios header cleared.");
	}
};

// --- API Error Handling ---
const handleApiError = (error, context = "API Call") => {
	console.error(`${context} Error:`, error.response || error.message || error);
	if (error.response) {
		const serverError =
			error.response.data?.error ||
			error.response.data?.message ||
			error.response.statusText ||
			"An unexpected server error occurred.";
		return new Error(serverError);
	} else if (error.request) {
		return new Error("Network error. Could not reach server. Please check connection.");
	} else {
		return new Error(error.message || "An unexpected error occurred.");
	}
};

// --- Service Functions ---

// Register a new user
const register = async (userData) => {
	try {
		if (!USE_API) {
			return await registerMock(userData);
		}
		console.log("AuthService: Calling POST /auth/register", userData);

		const response = await axios.post(`${API_URL}/auth/register`, userData);
		console.log("AuthService: Registration Response:", response.data);
		return response.data;
	} catch (error) {
		throw handleApiError(error, "Registration");
	}
};

// Login user
const login = async (credentials) => {
	try {
		if (!USE_API) {
			const data = await loginMock(credentials);
			setAuthToken(data.token);
			return data;
		}

		console.log("AuthService: Calling POST /auth/login", credentials);
		const response = await axios.post(`${API_URL}/auth/login`, credentials);
		console.log("AuthService: Login Response:", response.data);

		if (response.data && response.data.token) {
			localStorage.setItem("token", response.data.token);
			setAuthToken(response.data.token);
		} else {
			console.warn("AuthService: Token missing in login response.");
			localStorage.removeItem("token");
			setAuthToken(null);
		}

		if (response.data && response.data.user) {
			localStorage.setItem("currentUser", JSON.stringify(response.data.user));
		} else {
			console.warn("AuthService: User object missing in login response.");
			localStorage.removeItem("currentUser");
		}

		console.log("AuthService: Login Response Data Received:", response.data);
		return response.data;
	} catch (error) {
		localStorage.removeItem("token");
		localStorage.removeItem("currentUser");
		setAuthToken(null);
		throw handleApiError(error, "Login");
	}
};

// Google Login - Backend Call
const googleLogin = async (tokenData) => {
	try {
		console.log("AuthService: Calling POST /auth/google", tokenData);
		const response = await axios.post(`${API_URL}/auth/google`, tokenData);
		console.log("AuthService: Google Login Response:", response.data);
		return response.data;
	} catch (error) {
		throw handleApiError(error, "Google Login");
	}
};

// Backend Logout Call
const logoutUserBackend = async () => {
	console.log("AuthService: Calling POST /auth/logout");
	const token = localStorage.getItem("token");

	if (!token) {
		console.warn("AuthService: No token found, skipping backend logout call.");
		return { message: "No active session on frontend." };
	}
	try {
		const response = await axios.post(
			`${API_URL}/auth/logout`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		console.log("AuthService: Backend Logout Response:", response.data);
		return response.data;
	} catch (error) {
		console.error("AuthService: Backend logout call failed:", error.response || error.message || error);
		return {
			message: "Backend logout call failed, proceeding with frontend logout.",
			error: true,
		};
	}
};

// Logout user (clears local state)
const logout = () => {
	console.log("AuthService: Clearing local storage and Axios header for logout.");
	if (!USE_API) {
		logoutMock();
	} else {
		localStorage.removeItem("token");
		localStorage.removeItem("currentUser");
	}
	setAuthToken(null);
};

// Check if user is logged in
const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	return !!token;
};

// Get token
const getToken = () => {
	return localStorage.getItem("token");
};

// Get current user
const getCurrentUserFromStorage = () => {
	const userStr = localStorage.getItem("currentUser");
	try {
		return userStr ? JSON.parse(userStr) : null;
	} catch (e) {
		console.error("Failed to parse currentUser from localStorage", e);
		localStorage.removeItem("currentUser");
		return null;
	}
};

const authService = {
	register,
	login,
	logout,
    logoutUserBackend,
	isAuthenticated,
	getToken,
	getCurrentUserFromStorage,
	setAuthToken,
	API_URL,
	USE_API,
	AUTH_MODE,
};

export default authService;
