import { format, isToday, isThisWeek } from 'date-fns';
import Todo from './todo.js';

export default function loadTodos() {
    const todos = Array.from(document.getElementsByClassName("todo"));
    let todoList = [];
    todos.forEach((todo) => todoList.push(Todo.createTodoFromDiv(todo)));

    return todoList;
}

export function removeAllTodos() {
    const todos = Array.from(document.getElementsByClassName("todo"));
    todos.forEach((todo) => todo.remove());
}

export function showAndReturnTodo(todo) {
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
    const addTodoForm = document.getElementById("add-todo-form");
    content.insertBefore(newTodo, addTodoForm);

    return newTodo;
}

export function showAllTodos(todoList) {
    document.getElementById("project-title").textContent = "All";
    removeAllTodos();

    todoList.forEach((todo) => showAndReturnTodo(todo));
    return;
}

export function showTodosToday(todoList) {
    document.getElementById("project-title").textContent = "Today";
    removeAllTodos();

    todoList.forEach((todo) => {
        if (isToday(todo.dueDate)) {
            showAndReturnTodo(todo);
        }
    });
    return;
}

export function showTodosThisWeek(todoList) {
    document.getElementById("project-title").textContent = "This Week";
    removeAllTodos();

    todoList.forEach((todo) => {
        if (isThisWeek(todo.dueDate)) {
            showAndReturnTodo(todo);
        }
    });
    return;
}

export function showTodosForProject(todoList, project) {
    document.getElementById("project-title").textContent = project;
    removeAllTodos();

    todoList.forEach((todo) => {
        if (todo.project === project) {
            showAndReturnTodo(todo);
        }
    })
    return;
}
