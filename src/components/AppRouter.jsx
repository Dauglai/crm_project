import React from "react";
import {Routes, Route, Navigate} from 'react-router-dom';
import About from '../pages/About';
import Login from "../pages/Login";
import {AuthContext} from "../context";
import Loader from "./UI/Loader/Loader";
import Tasks from "../pages/Tasks";
import TaskForm from "./TaskCreateForm";
import TaskIdPage from "../pages/TaskIdPage";
import ProfilePage from "../pages/ProfilePage";

function AppRouter() {
    const {isAuth, isLoading} = React.useContext(AuthContext);
    if (isLoading){
        return <Loader/>
    }
    return (
        isAuth
            ? <Routes>
                <Route path="/tasks" Component={Tasks}/>
                <Route path="/tasks/create" Component={TaskForm}/>
                <Route path="/tasks/:id" Component={TaskIdPage}/>
                <Route path="/about" Component={About}/>
                <Route path="/profile" Component={ProfilePage}/>
                <Route path="/login" Component={Login}/>
                <Route
                    path="*"
                    element={<Navigate to="/profile" replace/>}
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