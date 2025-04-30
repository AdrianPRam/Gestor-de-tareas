import { loadTasks, saveTasks } from './storage.js';
import { displayTasks } from './display.js';
import { Task, Category } from './models.js';

async function loadJsonTasks(jsonName) {
    try {
        // Asegurar que el nombre termine en .json
        const fileName = jsonName.endsWith('.json') ? jsonName : `${jsonName}.json`;
        const response = await fetch(`dades/${fileName}`);
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar el archivo ${fileName}: ${response.status}`);
        }

        const jsonData = await response.json();

        // Convertir los datos JSON a instancias de Task
        const jsonTasks = jsonData.map(task => {
            const categoria = new Category(task.categoria.nom, task.categoria.color);
            return new Task(
                task.id,
                task.titol,
                task.descripcio,
                task.data,
                categoria,
                task.prioritat,
                task.realitzada || false
            );
        });

        // Obtener tareas actuales de localStorage
        const existingTasks = loadTasks();

        // Fusionar tareas, evitando duplicados por ID
        const taskMap = new Map();
        existingTasks.forEach(task => taskMap.set(task.id, task));
        jsonTasks.forEach(task => taskMap.set(task.id, task)); // Sobrescribe si hay duplicados

        const mergedTasks = Array.from(taskMap.values());

        // Guardar las tareas fusionadas en localStorage
        saveTasks(mergedTasks);

        // Mostrar tareas y actualizar gráfico
        displayTasks(mergedTasks);

        return mergedTasks;
    } catch (error) {
        console.error('Error al cargar el JSON:', error);
        alert(`Error al cargar el archivo ${jsonName}. Verifica el nombre y asegúrate de que exista en la carpeta dades/.`);
        return [];
    }
}

function initJsonLoader() {
    const form = document.getElementById('json-loader-form');
    if (!form) {
        console.error('No se encontró el elemento #json-loader-form en el DOM');
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const jsonNameInput = document.getElementById('json-name');
        const jsonName = jsonNameInput.value.trim();
        if (!jsonName) {
            return; // No hacer nada si el campo está vacío
        }

        await loadJsonTasks(jsonName);
        jsonNameInput.value = ''; // Limpiar el campo
    });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const tasks = loadTasks();
        displayTasks(tasks); // Carga tareas iniciales de localStorage
        initJsonLoader(); // Inicializa el cargador de JSON
    } catch (error) {
        console.error('Error al inicializar la página:', error);
    }
});