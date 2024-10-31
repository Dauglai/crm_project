import { useMemo } from 'react';

export const useSortedTasks = (tasks, sort) => {
    const sortedTasks = useMemo(() => {
        if (sort && tasks) {
            return [...tasks].sort((a, b) => {
                const aValue = a[sort] || '';
                const bValue = b[sort] || '';
                return aValue.localeCompare(bValue);
            });
        }
        return tasks;
    }, [sort, tasks]);

    return sortedTasks;
};

export const useTasks = (tasks, sort, query) => {
    const sortedTasks = useSortedTasks(tasks, sort);
    const sortedAndSearchedTasks = useMemo(() => {
        return sortedTasks.filter(task =>
            (task.name ? task.name.toLowerCase() : '').includes(query ? query.toLowerCase() : '')
        );
    }, [query, sortedTasks]);

    return sortedAndSearchedTasks;
};
