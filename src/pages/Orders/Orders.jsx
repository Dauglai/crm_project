import React from "react";
import OrderList from "../../components/OrderList/OrderList";
import {AuthContext} from "../../context"; // Подключаем контекст аутентификации

const OrdersPage = () => {
    const { currentUser } = React.useContext(AuthContext);

    return (
        <OrderList currentUser={currentUser} />
    );
};

export default OrdersPage;