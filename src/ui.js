import { format, isToday, isThisWeek } from 'date-fns';
import Todo, { createTodoFromDiv } from './todo.js';

export default function loadTodos() {
    const todos = Array.from(document.getElementsByClassName("todo"));
    let todoList = [];
    todos.forEach((todo) => todoList.push(createTodoFromDiv(todo)));

    return todoList;
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

    const editTodoTitle = document.createElement("input");
    editTodoTitle.type = "text";
    editTodoTitle.classList.add("edit-todo-title");
    editTodoTitle.classList.add("hidden");
    editTodoTitle.name = "edit-todo-title";

    const todoDetailsBtn = document.createElement("button");
    todoDetailsBtn.classList.add("todo-details-btn");
    todoDetailsBtn.textContent = "DETAILS";

    const todoDueDate = document.createElement("div");
    todoDueDate.classList.add("todo-due-date");
    todoDueDate.textContent = format(todo.dueDate, "yyyy-MM-dd");

    const editTodoDueDate = document.createElement("input");
    editTodoDueDate.type = "date";
    editTodoDueDate.classList.add("edit-todo-due-date");
    editTodoDueDate.classList.add("hidden");
    editTodoDueDate.name = "edit-todo-due-date";

    const todoEditBtn = document.createElement("button");
    todoEditBtn.classList.add("todo-edit-btn");

    const todoDeleteBtn = document.createElement("button");
    todoDeleteBtn.classList.add("todo-delete-btn");

    const todoDescription = document.createElement("div");
    todoDescription.classList.add("todo-description");
    todoDescription.textContent = todo.description;

    const editTodoDescription = document.createElement("textarea");
    editTodoDescription.classList.add("edit-todo-description");
    editTodoDescription.classList.add("hidden");
    editTodoDescription.name = "edit-todo-description";

    const cancelEditBtn = document.createElement("button");
    cancelEditBtn.classList.add("cancel-edit-btn");
    cancelEditBtn.classList.add("hidden");
    cancelEditBtn.textContent = "CANCEL";

    newTodo.appendChild(todoCheckboxBtn);
    newTodo.appendChild(todoTitle);
    newTodo.appendChild(editTodoTitle);
    newTodo.appendChild(todoDetailsBtn);
    newTodo.appendChild(todoDueDate);
    newTodo.appendChild(editTodoDueDate);
    newTodo.appendChild(todoEditBtn);
    newTodo.appendChild(todoDeleteBtn);
    newTodo.appendChild(todoDescription);
    newTodo.appendChild(editTodoDescription);
    newTodo.appendChild(cancelEditBtn);

    const content = document.getElementById("content");
    const addTodoForm = document.getElementById("add-todo-form");
    content.insertBefore(newTodo, addTodoForm);
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
