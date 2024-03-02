import { format, isToday, isThisWeek } from 'date-fns';
import Todo from './todo.js';
import storageAvailable from './storage.js';

export function reloadTodos(todoList, currentProject, currentView) {
    switch (currentProject) {
        case "":
            switch (currentView) {
                case "All":
                default:
                    showAllTodos(todoList);
                    break;
                case "Today":
                    showTodosToday(todoList);
                    break;
                case "This week":
                    showTodosThisWeek(todoList);
                    break;
            }
            break;
        default:
            showTodosForProject(todoList, currentProject);
            break;
    }
}

export function showProjects(projectList) {
    const projects = Array.from(document.getElementsByClassName("project-btn"));
    projects.forEach((project) => project.remove());

    const btnContainer = Array.from(document.getElementsByClassName("btn-container")).at(-1);
    const projectAddContainer = document.getElementById("project-add-container");

    projectList.forEach((project) => {
        const projectBtn = document.createElement("button");
        projectBtn.classList.add("project-btn");
        
        const projectIcon = document.createElement("i");
        projectIcon.classList.add("fa-solid");
        projectIcon.classList.add("fa-list");

        const projectSpan = document.createElement("span");
        projectSpan.textContent = project;

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid");
        deleteIcon.classList.add("fa-trash");
        deleteIcon.classList.add("project-delete-btn");

        projectBtn.appendChild(projectIcon);
        projectBtn.appendChild(projectSpan);
        projectBtn.appendChild(deleteIcon);

        btnContainer.insertBefore(projectBtn, projectAddContainer);
    });
}

export function loadStorage(todoList, projectList) {
    console.log(window.localStorage);
    const todos = JSON.parse(window.localStorage.getItem("todos"));
    todos.forEach((todo) => todoList.push(Todo.fromJSON(todo)));
    showAllTodos(todoList);

    const projects = JSON.parse(window.localStorage.getItem("projects"));
    projects.forEach((project) => projectList.push(project));
    showProjects(projectList);

    const currentProject = JSON.parse(window.localStorage.getItem("currentProject"));
    const currentView = JSON.parse(window.localStorage.getItem("currentView"));
    reloadTodos(todoList, currentProject, currentView);

    return [currentProject, currentView];
}

export function loadDefaults(todoList, projectList) {
    const todos = Array.from(document.getElementsByClassName("todo"));
    todos.forEach((todo) => todoList.push(Todo.fromDiv(todo)));

    const projects = Array.from(document.getElementsByClassName("project-btn"));
    projects.forEach((project) => projectList.push(project.textContent));

    return ["", "All"];
}

export default function loadData(todoList, projectList) {
    // window.localStorage.clear();
    if (storageAvailable("localStorage") && window.localStorage.length !== 0) {
        return loadStorage(todoList, projectList);
    } else {
        return loadDefaults(todoList, projectList);
    }
}

export function removeAllTodos() {
    const todos = Array.from(document.getElementsByClassName("todo"));
    todos.forEach((todo) => todo.remove());
}

export function showTodo(todo) {
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo");
    newTodo.classList.add(todo.priority);
    if (todo.checked) newTodo.classList.add("checked");
    newTodo.dataset.project = todo.project;
    newTodo.dataset.id = todo.id;

    const todoCheckboxBtn = document.createElement("button");
    todoCheckboxBtn.classList.add("todo-checkbox-btn");

    const todoTitle = document.createElement("div");
    todoTitle.classList.add("todo-title");
    todoTitle.textContent = todo.title;

    const todoEditTitle = document.createElement("input");
    todoEditTitle.type = "text";
    todoEditTitle.classList.add("todo-edit-title");
    todoEditTitle.classList.add("hidden");
    todoEditTitle.name = "todo-edit-title";

    const todoDetailsBtn = document.createElement("button");
    todoDetailsBtn.classList.add("todo-details-btn");
    todoDetailsBtn.textContent = "DETAILS";

    const todoDueDate = document.createElement("div");
    todoDueDate.classList.add("todo-due-date");
    todoDueDate.textContent = format(todo.dueDate, "yyyy-MM-dd");

    const todoEditDueDate = document.createElement("input");
    todoEditDueDate.type = "date";
    todoEditDueDate.classList.add("todo-edit-due-date");
    todoEditDueDate.classList.add("hidden");
    todoEditDueDate.name = "todo-edit-due-date";

    const todoEditBtn = document.createElement("button");
    todoEditBtn.classList.add("todo-edit-btn");

    const todoDeleteBtn = document.createElement("button");
    todoDeleteBtn.classList.add("todo-delete-btn");

    const todoDescription = document.createElement("div");
    todoDescription.classList.add("todo-description");
    todoDescription.textContent = todo.description;

    const todoEditDescription = document.createElement("textarea");
    todoEditDescription.classList.add("todo-edit-description");
    todoEditDescription.classList.add("hidden");
    todoEditDescription.name = "todo-edit-description";

    const cancelEditBtn = document.createElement("button");
    cancelEditBtn.classList.add("todo-cancel-edit-btn");
    cancelEditBtn.classList.add("hidden");
    cancelEditBtn.textContent = "CANCEL";

    newTodo.appendChild(todoCheckboxBtn);
    newTodo.appendChild(todoTitle);
    newTodo.appendChild(todoEditTitle);
    newTodo.appendChild(todoDetailsBtn);
    newTodo.appendChild(todoDueDate);
    newTodo.appendChild(todoEditDueDate);
    newTodo.appendChild(todoEditBtn);
    newTodo.appendChild(todoDeleteBtn);
    newTodo.appendChild(todoDescription);
    newTodo.appendChild(todoEditDescription);
    newTodo.appendChild(cancelEditBtn);

    const content = document.getElementById("content");
    const todoAddForm = document.getElementById("todo-add-form");
    content.insertBefore(newTodo, todoAddForm);
}

export function showAllTodos(todoList) {
    document.getElementById("project-title").textContent = "All";
    removeAllTodos();

    todoList.forEach((todo) => showTodo(todo));
}

export function showTodosToday(todoList) {
    document.getElementById("project-title").textContent = "Today";
    removeAllTodos();

    todoList.forEach((todo) => {
        if (isToday(todo.dueDate)) {
            showTodo(todo);
        }
    });
}

export function showTodosThisWeek(todoList) {
    document.getElementById("project-title").textContent = "This Week";
    removeAllTodos();

    todoList.forEach((todo) => {
        if (isThisWeek(todo.dueDate)) {
            showTodo(todo);
        }
    });
}

export function showTodosForProject(todoList, project) {
    document.getElementById("project-title").textContent = project;
    removeAllTodos();

    todoList.forEach((todo) => {
        if (todo.project === project) {
            showTodo(todo);
        }
    })
}
