import { parse } from "date-fns";

export default class Todo {
    title;
    description;
    dueDate;
    priority;
    checked;
    project;
    id;

    constructor(title, description, dueDate, priority, checked, project, id){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checked = checked;
        this.project = project;
        this.id = id;
    }

    toggleChecked() {
        this.checked = !this.checked;
    }

    static fromDiv(todoDiv){
        const todoTitle = todoDiv.getElementsByClassName("todo-title")[0].textContent;
        const todoDescription = todoDiv.getElementsByClassName("todo-description")[0].textContent;
        const todoDueDate = parse(todoDiv.getElementsByClassName("todo-due-date")[0].textContent, "yyyyyy-MM-dd", new Date());
        const todoPriority = todoDiv.classList[1];
        const todoChecked = todoDiv.classList.contains("checked");
        const todoProject = todoDiv.dataset.project;
        const todoId = todoDiv.dataset.id;

        return new Todo(todoTitle, todoDescription, todoDueDate, todoPriority, todoChecked, todoProject, todoId);
    }

    static fromJSON(todoJSON){
        const todoTitle = todoJSON.title;
        const todoDescription = todoJSON.description;
        const todoDueDate = todoJSON.dueDate;
        const todoPriority = todoJSON.priority;
        const todoChecked = todoJSON.checked;
        const todoProject = todoJSON.project;
        const todoId = todoJSON.id;

        return new Todo(todoTitle, todoDescription, todoDueDate, todoPriority, todoChecked, todoProject, todoId);
    }

}
