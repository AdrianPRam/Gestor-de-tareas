export class Task {
    constructor(id, titol, descripcio, data, categoria, prioritat, realitzada = false) {
        this.id = id;
        this.titol = titol;
        this.descripcio = descripcio;
        this.data = data;
        this.categoria = categoria;
        this.prioritat = prioritat;
        this.realitzada = realitzada;
    }
}

export class Category {
    constructor(nom, color) {
        this.nom = nom;
        this.color = color;
    }
}