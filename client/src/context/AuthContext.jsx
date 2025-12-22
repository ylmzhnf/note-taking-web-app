//3. Sütun: Kullanıcı girişi ve notları tutan State (AuthContext)
import React, { createContext, useEffect, useState } from "react";
import apiClient from "../api/axios";

export const AuthContext = createContext();


// 2. Context'i sağlayacak bileşen (Provider)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const [loading, setLoading] = useState(true);

    const updateToken = (newToken) => {
        if (newToken) {
            localStorage.setItem("token", newToken);
            setToken(newToken);
        } else {
            localStorage.removeItem('token');
            setToken(null)
        }
    }

    const refreshUser = async () => {
        try {
            const res = await apiClient.get("/auth/me");
            setUser(res.data);
        } catch (error) {
            console.error("User refresh failed:", error);
            if (error.response?.status === 401) {
                updateToken(null);
                setUser(null);
            }
        }
    };

    useEffect(() => {
        const checkLoggedIn = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    await refreshUser();
                } catch (error) {
                    console.error("Token geçersiz:", error);
                    updateToken(null);
                }
            }
            setLoading(false)
        };
        checkLoggedIn();
    }, []);


    const login = async (email, password) => {
        try {
            const result = await apiClient.post("/auth/login", { email, password });
            updateToken(result.data.token);
            await refreshUser();
            setLoading(false);
            return result.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const register = async (username, email, password) => {
        try {
            const result = await apiClient.post("/auth/register", { username, email, password });
            console.log(result);
            setLoading(false);
            return { success: true, message: result.data.message };
        } catch (error) {
            console.error("Registration error: ", error)
            throw error;
        }
    }

    const passwordForgot = async (email) => {
        try {
            const result = await apiClient.post("/auth/password-forgot", { email });
            console.log(result);
            setLoading(false);
            return { success: true, message: result.data.message };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const passwordReset = async (email, token, newPassword) => {
        try {
            const result = await apiClient.post("/auth/password-reset", { email, token, newPassword });
            console.log(result);
            setLoading(false);
            return { success: true, message: result.data.message };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const google = async (token) => {
        setLoading(true);
        try {
            const result = await apiClient.post("/auth/google", { token });
            updateToken(result.data.token);
            await refreshUser();
            setLoading(false);
            return { success: true, message: result.data.message };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const logout = () => {
        updateToken(null);
        setUser(null);
        setLoading(false);
    }

    const contextValue = {
        user, login, register, logout, loading, passwordForgot, passwordReset, google, refreshUser
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}



