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
        return sortedTasks.filter(task => {
            const searchQuery = query ? query.toLowerCase() : "";

            return (
                (task.name && task.name.toLowerCase().includes(searchQuery)) ||
                (task.surname && task.surname.toLowerCase().includes(searchQuery)) ||
                (task.author && task.author.surname.toLowerCase().includes(searchQuery)) ||
                (task.addressee && task.addressee.surname.toLowerCase().includes(searchQuery)) ||
                (task.id && task.id.toString().includes(searchQuery))
            );
        });
    }, [query, sortedTasks]);

    return sortedAndSearchedTasks;
};
