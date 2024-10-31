import React from "react";
import MyInput from "./UI/input/MyInput";
import MySelect from "./UI/select/MySelect";


const TaskFilter = ({filter, setFilter}) => {
    return (
        <div>
            <MyInput
                value={filter.query}
                onChange={e => setFilter({...filter, query: e.target.value})}
                placeholder='Поиск'
            />
            <MySelect
                value={filter.sort}
                onChange={selectedSort => setFilter({...filter, sort: selectedSort})}
                options={[{name: 'По теме', value: 'name'}, {name: 'По сроку выполнения', value: 'deadline'}]} defaultValue={'Фильтры'}
            />
        </div>
    )
};

export default TaskFilter;