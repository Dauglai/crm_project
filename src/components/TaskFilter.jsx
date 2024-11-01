import React from "react";
import MyInput from "./UI/input/MyInput";
import MySelect from "./UI/select/MySelect";

const TaskFilter = ({ filter, setFilter }) => {
    return (
        <div>
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
                defaultValue="Фильтры"
            />
            <MySelect
                value={filter.role}
                onChange={(selectedRole) => setFilter({ ...filter, role: selectedRole })}
                options={[
                    { name: "Автор", value: "author" },
                    { name: "Адресат", value: "addressee" },
                    { name: "Соглосователь", value: "coordinator" },
                    { name: "Наблюдатель", value: "observer" },
                    { name: "Все с моим участием", value: "all" },
                ]}
                defaultValue="Роль"
            />
        </div>
    );
};

export default TaskFilter;
