import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null)

    const loginFunction = async (t) => {
        localStorage.setItem('token', t)
        setToken(t)
        return
    }


    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [])


    return (
        <AuthContext.Provider value={{ token, loginFunction }}>{children}</AuthContext.Provider>
    );
};