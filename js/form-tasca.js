import { Task } from './models.js';
import { loadCategories, loadTasks, saveTasks, generateTaskId } from './storage.js';
//esta funcion carga las categorias al menu de las tascas de creacion
function populateCategories() {
    
    const categorySelect = document.getElementById('categoria');
    if (!categorySelect) {
        console.error('No se encontró el elemento #categoria en el DOM');
        return;
    }
    categorySelect.innerHTML = '<option value="">Selecciona una categoria</option>';
    const categories = loadCategories();
    console.log('Categorías cargadas desde localStorage:', categories);
    if (categories.length === 0) {
        console.warn('No hay categorías disponibles en localStorage. Crea una categoría en categories.html');
        categorySelect.innerHTML += '<option value="" disabled>No hi ha categories disponibles</option>';
    }
    categories.forEach(category => {
        if (category.nom && category.color) {
            const option = document.createElement('option');
            option.value = JSON.stringify(category);
            option.textContent = category.nom;
            categorySelect.appendChild(option);
        } 
    });
    
        
    
}
// aqui he tenido ayuda un poco porque no me cargaba las tareas bien
function handleSubmit(event) {
    event.preventDefault();
    
    try {
        const titol = document.getElementById('titol').value.trim();
        const descripcio = document.getElementById('descripcio').value.trim();
        const data = document.getElementById('data').value;
        const categoriaValue = document.getElementById('categoria').value;
        const prioritat = document.getElementById('prioritat').value;

        if (!titol || !descripcio || !data || !categoriaValue || !prioritat) {
            alert('Tots els camps són obligatoris!');
            return;
        }

        let categoria;
        try {
            categoria = JSON.parse(categoriaValue);
            if (!categoria.nom || !categoria.color) {
                throw new Error('Categoría inválida');
            }
        } catch (error) {
            console.error('Error al parsear la categoría:', error);
            alert('Selecciona una categoria vàlida.');
            return;
        }

        const id = generateTaskId();
        const task = new Task(id, titol, descripcio, data, categoria, prioritat, false);

        const tasks = loadTasks();
        tasks.push(task);
        saveTasks(tasks);

        alert('Tasca afegida amb èxit!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al guardar la tarea:', error);
        alert('Error al afegir la tasca. Consulta la consola.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const form = document.getElementById('task-form');
        if (!form) {
            console.error('No se encontró el elemento #task-form en el DOM');
            return;
        }
        populateCategories();
        form.addEventListener('submit', handleSubmit);
    } catch (error) {
        console.error('Error al inicializar el formulario:', error);
        alert('Error al inicializar el formulario. Consulta la consola.');
    }
});