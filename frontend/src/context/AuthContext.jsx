import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/axiosInstance'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) 

    // Fetch user profile when token changes
    const fetchUserProfile = async (authToken) => {
        try {
            const response = await api.get('/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // If token is invalid, clear it
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken){
            setToken(storedToken)
            fetchUserProfile(storedToken)
        }
        setLoading(false)
    }, [])

    const login = (newToken, userData = null) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        if (userData) {
            setUser(userData)
        } else {
            fetchUserProfile(newToken)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{ 
            token, 
            user, 
            isAdmin: user?.is_admin || false,
            login, 
            logout, 
            loading 
        }} >
            {!loading && children}
        </AuthContext.Provider>
    )
}