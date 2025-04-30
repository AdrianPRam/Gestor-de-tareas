import { loadTasks, saveTasks } from './storage.js';
import { displayTasks } from './display.js';
import { Task, Category } from './models.js';

//aqui he tenido un poco de ayuda porque cuando cargaba el JSON se sobreescribian las tareas ya creadas
function generateUniqueId(existingIds) {
    let newId;
    do {
        newId = `task-${Math.random().toString(36).substr(2, 9)}`;
    } while (existingIds.has(newId));
    return newId;
}

//esto solo chequea si estan duplicadas las tareas
function isDuplicateTask(task1, task2) {
    return (
        task1.titol === task2.titol &&
        task1.data === task2.data &&
        task1.categoria.nom === task2.categoria.nom &&
        task1.prioritat === task2.prioritat
    );
}
//carga las tareas del JSON con un fetch y mira que no sobreescriba las tareas y que no esten repetidas
//aqui he tenido ayuda por el mismo problema de duplicidad
async function loadJsonTasks(jsonName) {
    try {
        // Asegurar que el nombre termine en .json
        const fileName = jsonName.endsWith('.json') ? jsonName : `${jsonName}.json`;
        const response = await fetch(`dades/${fileName}`);
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar el archivo ${fileName}: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log('Tareas en JSON:', jsonData.length, jsonData);

        // Obtener tareas actuales de localStorage
        const existingTasks = loadTasks();
        console.log('Tareas en localStorage:', existingTasks.length, existingTasks);

        // Conjunto de IDs existentes
        const existingIds = new Set(existingTasks.map(task => task.id));

        // Convertir y validar tareas del JSON
        const jsonTasks = [];
        const errors = [];
        jsonData.forEach((task, index) => {
            try {
                if (
                    !task.titol ||
                    !task.data ||
                    !task.categoria ||
                    !task.categoria.nom ||
                    !task.categoria.color ||
                    !task.prioritat
                ) {
                    throw new Error(`Faltan propiedades requeridas en la tarea ${index + 1}`);
                }
                const categoria = new Category(task.categoria.nom, task.categoria.color);
                const taskId = generateUniqueId(existingIds); // Generar ID único
                existingIds.add(taskId);
                const newTask = new Task(
                    taskId,
                    task.titol,
                    task.descripcio || '',
                    task.data,
                    categoria,
                    task.prioritat,
                    task.realitzada || false
                );
                jsonTasks.push(newTask);
            } catch (error) {
                errors.push(`Error en la tarea ${index + 1}: ${error.message}`);
            }
        });
        if (errors.length > 0) {
            console.warn('Errores al procesar tareas del JSON:', errors);
        }
        console.log('Tareas válidas del JSON:', jsonTasks.length, jsonTasks);

        // Filtrar duplicados comparando con localStorage y dentro de jsonTasks
        const uniqueJsonTasks = [];
        jsonTasks.forEach(jsonTask => {
            const isDuplicate = existingTasks.some(existing => isDuplicateTask(existing, jsonTask)) ||
                               uniqueJsonTasks.some(unique => isDuplicateTask(unique, jsonTask));
            if (!isDuplicate) {
                uniqueJsonTasks.push(jsonTask);
            } else {
                console.log('Tarea duplicada omitida:', jsonTask);
            }
        });
        console.log('Tareas únicas del JSON:', uniqueJsonTasks.length, uniqueJsonTasks);

        // Fusionar tareas: todas las de localStorage + tareas únicas del JSON
        const mergedTasks = [...existingTasks, ...uniqueJsonTasks];
        console.log('Tareas fusionadas:', mergedTasks.length, mergedTasks);

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