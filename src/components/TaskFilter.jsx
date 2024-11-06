// TaskFilter.js
import React from "react";
import MyInput from "./UI/input/MyInput";
import MySelect from "./UI/select/MySelect";
import RoleList from "./UI/RoleList/RoleList";
import '../styles/Tasks.css'; // Подключаем стили

const TaskFilter = ({ filter, setFilter, limit, setLimit, setPage }) => {
    return (
        <div className="filter-table-container">
            <div className="filter-container">
                <MyInput
                    value={filter.query}
                    onChange={(e) => setFilter({ ...filter, query: e.target.value })}
                    placeholder="Поиск"
                />
                <MySelect
                    value={filter.sort}
                    onChange={(selectedSort) => setFilter({ ...filter, sort: selectedSort })}
                    options={[
                        { name: "По теме", value: "name" },
                        { name: "По сроку выполнения", value: "deadline" },
                        { name: "По статусу", value: "status" },
                    ]}
                    defaultValue="Сортировка"
                />
                <MySelect
                    value={limit}
                    onChange={(val) => {
                        setLimit(val);
                        setPage(1);
                    }}
                    options={[
                        { value: 5, name: '5' },
                        { value: 10, name: '10' },
                        { value: 25, name: '25' },
                        { value: 100, name: '100' },
                    ]}
                    defaultValue="Кол-во постов на странице"
                />
            </div>
        </div>
    );
};

export default TaskFilter;