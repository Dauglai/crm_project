import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import About from "../pages/About";
import Login from "../pages/Login";
import { AuthContext } from "../context";
import Loader from "./UI/Loader/Loader";
import Tasks from "../pages/Tasks/Tasks";
import TaskForm from "./TaskCRUD/TaskCreateForm";
import TaskIdPage from "../pages/TaskId/TaskIdPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import OrderForm from "../pages/Order/OrderPage";
import ProductManager from "../pages/Product/ProductPage";
import ClientManager from "../pages/Client/ClientPage";
import OutletManager from "../pages/Outlet/OutletManager";
import TasksByDay from "../pages/TasksByDay/TasksByDay";
import ProtectedRoute from "./API/ProtectedRoute";


function AppRouter() {
    const { isAuth, isLoading } = React.useContext(AuthContext);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="*"
                element={isAuth ? <Navigate to="/tasks_by_day" replace /> : <Navigate to="/login" replace />}
            />
            <Route
                path="/tasks"
                element={<ProtectedRoute><Tasks /></ProtectedRoute>}
            />
            <Route
                path="/tasks_by_day"
                element={<ProtectedRoute><TasksByDay /></ProtectedRoute>}
            />
            <Route
                path="/tasks/create"
                element={<ProtectedRoute><TaskForm /></ProtectedRoute>}
            />
            <Route
                path="/tasks/:id"
                element={<ProtectedRoute><TaskIdPage /></ProtectedRoute>}
            />
            <Route
                path="/about"
                element={<ProtectedRoute><About /></ProtectedRoute>}
            />
            <Route
                path="/profile"
                element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
            />
            <Route
                path="/orders"
                element={<ProtectedRoute><OrderForm /></ProtectedRoute>}
            />
            <Route
                path="/outlets"
                element={<ProtectedRoute><OutletManager /></ProtectedRoute>}
            />
            <Route
                path="/products"
                element={<ProtectedRoute><ProductManager /></ProtectedRoute>}
            />
            <Route
                path="/clients"
                element={<ProtectedRoute><ClientManager /></ProtectedRoute>}
            />
        </Routes>
    );
}

export default AppRouter;
