import { loadCategories, saveCategories } from './storage.js';
import { Category } from './models.js';

document.addEventListener('DOMContentLoaded', () => {
    displayCategories();
    document.getElementById('category-form').addEventListener('submit', handleAddCategory);
});

function displayCategories() {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    const categories = loadCategories();
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        categoryElement.innerHTML = `
            <span class="name">${category.nom}</span>
            <span class="color" style="background-color: ${category.color};"></span>
            <button class="delete-btn" data-nom="${category.nom}">Eliminar</button>
        `;
        categoryList.appendChild(categoryElement);
        categoryElement.querySelector('.delete-btn').addEventListener('click', () => handleDeleteCategory(category.nom));
    });
}

function handleAddCategory(event) {
    event.preventDefault();
    const nom = document.getElementById('nom').value.trim();
    const color = document.getElementById('color').value;
    const categories = loadCategories();
    if (categories.some(category => category.nom === nom)) {
        alert('La categoria ja existeix!');
        return;
    }
    categories.push(new Category(nom, color));
    saveCategories(categories);
    displayCategories();
    event.target.reset();
}

function handleDeleteCategory(nom) {
    let categories = loadCategories();
    categories = categories.filter(category => category.nom !== nom);
    saveCategories(categories);
    displayCategories();
}
