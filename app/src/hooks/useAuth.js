import React, { useState, useEffect, useContext, createContext } from "react";
import { useHistory } from "react-router-dom";
import api from "../interceptor";

const AuthContext = createContext(null);

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}


export const useAuth = () => {
    return useContext(AuthContext);
};


function useProvideAuth() {
    const history = useHistory();
    const [user, setUser] = useState(localStorage.getItem('user'));

    const signin = (credentials) => {
        return api.post('/api/login', credentials).then(res => {
            if (res.code === 200) {
                setUser(res.data.user);
                localStorage.setItem('user', res.data.user);
                history.push('/');
            } else {
                alert("Please check your login information!")
            }
        })
        .catch(e => {
            alert("Please check your login information!")
        });
    };

    const signout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };


    useEffect(() => {
        let user = localStorage.getItem('user');
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    }, []);


    return {
        user,
        signin,
        signout,
    };
}
