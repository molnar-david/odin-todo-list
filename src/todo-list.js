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

    set addTodo(todo) {
        this.#todos.push(todo);
    }
}
