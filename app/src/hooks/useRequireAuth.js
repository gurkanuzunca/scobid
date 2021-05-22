import { useEffect } from "react";
import { useAuth } from "./useAuth.js";
import { useHistory } from "react-router-dom";

export function useRequireAuth() {
    const auth = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (auth.user === null) {
            history.push('/login');
        }
    }, [auth, history]);

    return auth;
}
