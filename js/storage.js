import { Task, Category } from './models.js';

export function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.map(task => new Task(task.id, task.titol, task.descripcio, task.data, task.categoria, task.prioritat, task.realitzada));
}

export function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    return categories.map(category => new Category(category.nom, category.color));
}

export function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

export function generateTaskId() {
    const tasks = loadTasks();
    const lastId = tasks.length > 0 ? parseInt(tasks[tasks.length - 1].id.split('-')[1]) : 0;
    return `task-${String(lastId + 1).padStart(3, '0')}`;
}