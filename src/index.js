import Todo from './todo.js';
import loadTodos, { showAllTodos, showTodosToday, showTodosThisWeek, showTodosForProject } from './ui.js';


function initContentBtns() {
    function fitEditDescriptionFieldToContent (field) {
        field.style.height = "auto"
        field.style.height = Math.min(field.scrollHeight, 240) + "px";
    }

    // Clicking anywhere on the div toggles the checkmark - clicking on checkbox is not necessary
    let todos = Array.from(document.getElementsByClassName("todo"));
    todos.forEach((todo) => todo.addEventListener("click", () => {
        todo.classList.toggle("checked");

        // Toggle "checked" on the class represantation as well
        todoList.forEach((todoItem) => {
            if (todoItem.index === todo.index) {
                todoItem.toggleChecked();
            }
        });
    }));

    const todoDetailsBtns = Array.from(document.getElementsByClassName("todo-details-btn"));
    todoDetailsBtns.forEach((btn) => btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.parentElement.classList.toggle("expanded");
    }));

    const editTitleFields = Array.from(document.getElementsByClassName("edit-todo-title"));
    editTitleFields.forEach((field) => field.addEventListener("click", (e) => e.stopPropagation()));

    const editDescriptionFields = Array.from(document.getElementsByClassName("edit-todo-description"));
    editDescriptionFields.forEach((field) => field.addEventListener("click", (e) => e.stopPropagation()));

    editDescriptionFields.forEach((field) => field.addEventListener("keydown", () => fitEditDescriptionFieldToContent(field)));

    editDescriptionFields.forEach((field) => field.addEventListener("keyup", () => fitEditDescriptionFieldToContent(field)));

    editDescriptionFields.forEach((field) => field.addEventListener("change", () => fitEditDescriptionFieldToContent(field)));

    const todoEditBtns = Array.from(document.getElementsByClassName("todo-edit-btn"));
    todoEditBtns.forEach((btn) => btn.addEventListener("click", (e) => {
        e.stopPropagation();

        // Change fields to forms
        const title = btn.parentElement.getElementsByClassName("todo-title")[0];
        title.classList.toggle("hidden");

        const editTitle = btn.parentElement.getElementsByClassName("edit-todo-title")[0];
        editTitle.classList.toggle("hidden");
        editTitle.value = title.textContent;

        const dueDate = btn.parentElement.getElementsByClassName("todo-due-date")[0];
        dueDate.classList.toggle("hidden");

        const editDueDate = btn.parentElement.getElementsByClassName("edit-todo-due-date")[0];
        editDueDate.classList.toggle("hidden");
        editDueDate.value = dueDate.textContent;

        const description = btn.parentElement.getElementsByClassName("todo-description")[0]
        description.classList.toggle("hidden");

        const editDescription = btn.parentElement.getElementsByClassName("edit-todo-description")[0]
        editDescription.classList.toggle("hidden");
        editDescription.value = description.textContent;
        fitEditDescriptionFieldToContent(editDescription);

        // Expand the description so that the user can see the result
        btn.parentElement.classList.add("expanded");
    }));

    const todoDeleteBtns = Array.from(document.getElementsByClassName("todo-delete-btn"));
    todoDeleteBtns.forEach((btn) => btn.addEventListener("click", (e) => {
        e.stopPropagation();

        // Remove items from class and DOM representation
        todoList.forEach((todoItem) =>  {
            if (todoItem.index === btn.parentElement.dataset.index) {
                todoList.splice(todoItem.index, 1);
                todos.splice(todoItem.index, 1);
            }
        });
        btn.parentElement.remove();

        // Fix indices in class and DOM representation
        for (let i = 0; i < todoList.length; i++) {
            for (let j = 0; j < todos.length; j++) {
                if (todoList[i].index === todos[j].dataset.index) {
                    todos[j].dataset.index = i.toString();
                }
            }
            todoList[i].index = i.toString();
        }
    }));
}

function initProjectBtn(btn) {
    btn.addEventListener("click", () => {
        showTodosForProject(todoList, btn.textContent);
        initContentBtns();
    });
}

function initSidebarBtns() {
    const allBtn = document.getElementById("all-btn");
    allBtn.addEventListener("click", () => {
        showAllTodos(todoList);
        initContentBtns();
    });

    const todayBtn = document.getElementById("today-btn");
    todayBtn.addEventListener("click", () => {
        showTodosToday(todoList);
        initContentBtns();
    });

    const weekBtn = document.getElementById("week-btn");
    weekBtn.addEventListener("click", () => {
        showTodosThisWeek(todoList)
        initContentBtns();
    });

    const projectBtns = Array.from(document.getElementsByClassName("project-btn"));
    projectBtns.forEach((btn) => initProjectBtn(btn));
}

function initBtns() {
    initSidebarBtns();
    initContentBtns();
}

let todoList = loadTodos();
initBtns();
