import { loadTasks, saveTasks } from './storage.js';
import { initChart } from './grafics.js';

function displayTasks(tasks) {
    try {
        const taskList = document.getElementById('task-list');
        const completedTaskList = document.getElementById('completed-tasks');
        

        const pendingTasks = tasks.filter(task => !task.realitzada);
        const completedTasks = tasks.filter(task => task.realitzada);

        taskList.innerHTML = pendingTasks.length ? '' : '<p>No hi ha tasques pendents.</p>';
        pendingTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });

        completedTaskList.innerHTML = completedTasks.length ? '' : '<p>No hi ha tasques realitzades.</p>';
        completedTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            completedTaskList.appendChild(taskElement);
        });

        initChart(tasks); // Actualiza el gráfico
    } catch (error) {
        console.error('Error al mostrar las tareas:', error);
    }
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
        <input type="checkbox" ${task.realitzada ? 'checked' : ''}>
        <div class="title">${task.titol}</div>
        <div class="description">${task.descripcio}</div>
        <div class="date">Data: ${task.data}</div>
        <div class="category" style="background-color: ${task.categoria.color}">${task.categoria.nom}</div>
        <div class="priority">Prioritat: ${task.prioritat}</div>
        <button class="delete-btn" data-id="${task.id}">Eliminar</button>
    `;

    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        try {
            const tasks = loadTasks();
            const taskToUpdate = tasks.find(t => t.id === task.id);
            if (taskToUpdate) {
                taskToUpdate.realitzada = checkbox.checked;
                saveTasks(tasks);
                displayTasks(tasks);
            }
        } catch (error) {
            console.error('Error al actualizar el estado de la tarea:', error);
        }
    });

    const deleteBtn = taskElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        try {
            const tasks = loadTasks();
            const updatedTasks = tasks.filter(t => t.id !== task.id);
            saveTasks(updatedTasks);
            displayTasks(updatedTasks);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    });

    return taskElement;
}

export { displayTasks };