import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange } from '../firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userClaims, setUserClaims] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            if (user) {
                try {
                    // Buscar claims do usuário
                    const idTokenResult = await user.getIdTokenResult();
                    setUserClaims(idTokenResult.claims);
                    setUser(user);
                } catch (err) {
                    console.error('Erro ao carregar claims do usuário:', err);
                    setError(err.message);
                    // Mesmo com erro nos claims, ainda mantemos o usuário
                    setUser(user);
                    setUserClaims({});
                }
            } else {
                setUser(null);
                setUserClaims(null);
                setError(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        error,
        userClaims
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;