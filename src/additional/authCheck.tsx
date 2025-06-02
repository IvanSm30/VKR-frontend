import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/store/hooks";

const useAuthRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        fetch("/api/auth/check", {
            method: "GET",
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Not authenticated");
                }
                return res.json();
            })
            .then(user => {
                dispatch({ type: "user/setUser", payload: user });
                navigate("/app");
            })
            .catch(() => {
                navigate("/login")
            });
    }, [navigate, dispatch]);
};

export default useAuthRedirect;
