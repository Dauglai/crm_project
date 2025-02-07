import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import {AuthContext} from "../../context";


const ProtectedRoute = ({ children }) => {
    const { isAuth } = useContext(AuthContext);

    return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
