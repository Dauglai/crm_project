import React from "react";
import {Routes, Route, Navigate} from 'react-router-dom';
import About from '../pages/About';
import Posts from '../pages/Posts';
import PostIdPages from "../pages/PostIdPage";
import Login from "../pages/Login";
import {AuthContext} from "../context";
import Loader from "./UI/Loader/Loader";

function AppRouter() {
    const {isAuth, isLoading} = React.useContext(AuthContext);
    if (isLoading){
        return <Loader/>
    }
    return (
        isAuth
            ? <Routes>
                <Route path="/posts" Component={Posts}/>
                <Route path="/posts/:id" Component={PostIdPages}/>
                <Route path="/about" Component={About}/>
                <Route path="/login" Component={Login}/>
                <Route
                    path="*"
                    element={<Navigate to="/posts" replace/>}
                />
            </Routes>
            : <Routes>
                <Route path="/login" Component={Login}/>
                <Route
                    path="*"
                    element={<Navigate to="/login" replace/>}
                />
            </Routes>

    )
};

export default AppRouter;