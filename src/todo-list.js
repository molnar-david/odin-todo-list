import Todo from './todo.js';

export default class TodoList {
    #title;
    #todos = [];

    constructor(title) {
        this.#title = title;
    }

    get title() {
        return this.#title;
    }

    get todos() {
        return this.#todos;
    }

    addTodo(todo) {
        this.#todos.push(todo);
    }

    popTodo(todo) {
        return this.#todos.splice(this.#todos.indexOf(todo), 1);
    }
}
