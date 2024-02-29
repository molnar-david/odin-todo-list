import { parse } from "date-fns";

export default class Todo {
    #title;
    #description;
    #dueDate;
    #priority;
    #checked;
    #project;
    #id;

    constructor(title, description, dueDate, priority, checked, project, id){
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#checked = checked;
        this.#project = project;
        this.#id = id;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get dueDate() {
        return this.#dueDate;
    }

    get priority() {
        return this.#priority;
    }

    get checked() {
        return this.#checked;
    }

    get project() {
        return this.#project;
    }

    get id() {
        return this.#id;
    }

    set title(newTitle) {
        this.#title = newTitle;
    }

    set description(newDescription) {
        this.#description = newDescription;
    }

    set dueDate(newDueDate) {
        this.#dueDate = newDueDate;
    }

    set priority(newPriority) {
        this.#priority = newPriority;
    }

    set id(newId) {
        this.#id = newId;
    }

    toggleChecked() {
        this.#checked = !this.#checked
    }
}

export function createTodoFromDiv (todoDiv){
    const todoTitle = todoDiv.getElementsByClassName("todo-title")[0].textContent;
    const todoDescription = todoDiv.getElementsByClassName("todo-description")[0].textContent;
    const todoDueDate = parse(todoDiv.getElementsByClassName("todo-due-date")[0].textContent, "yyyy-MM-dd", new Date());
    const todoPriority = todoDiv.classList[1];
    const todoChecked = todoDiv.classList.contains("checked");
    const todoProject = todoDiv.dataset.project;
    const todoId = todoDiv.dataset.id;

    return new Todo(todoTitle, todoDescription, todoDueDate, todoPriority, todoChecked, todoProject, todoId);
}
