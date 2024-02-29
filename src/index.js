import { parse } from 'date-fns';
import { createTodoFromDiv } from './todo.js';
import loadTodos, { showAllTodos, showTodosToday, showTodosThisWeek, showTodosForProject } from './ui.js';

function deleteTodo(todo) {
    const todoDivs = Array.from(document.getElementsByClassName("todo"));

    todoDivs.forEach((todoDiv) =>  {
        if (todoDiv.dataset.id === todo.id) {
            todoDiv.remove();
            for (const i in todoList) {
                if (todoList[i].id === todo.id)
                todoList.splice(i, 1);
            }
        }
    });
}

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
            if (todoItem.id === todo.id) {
                todoItem.toggleChecked();
            }
        });
    }));

    const todoDetailsBtns = Array.from(document.getElementsByClassName("todo-details-btn"));
    todoDetailsBtns.forEach((btn) => btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.parentElement.classList.toggle("expanded");
    }));

    // Make sure edit fields work as intended, clicking on them won't toggle "checked" state
    const editTitleFields = Array.from(document.getElementsByClassName("edit-todo-title"));
    editTitleFields.forEach((field) => field.addEventListener("click", (e) => e.stopPropagation()));

    const editDescriptionFields = Array.from(document.getElementsByClassName("edit-todo-description"));
    editDescriptionFields.forEach((field) => field.addEventListener("click", (e) => e.stopPropagation()));

    // Make sure editDescriptionField is sized properly for any reasonable action
    editDescriptionFields.forEach((field) => field.addEventListener("keydown", () => fitEditDescriptionFieldToContent(field)));

    editDescriptionFields.forEach((field) => field.addEventListener("keyup", () => fitEditDescriptionFieldToContent(field)));

    editDescriptionFields.forEach((field) => field.addEventListener("change", () => fitEditDescriptionFieldToContent(field)));

    const todoEditBtns = Array.from(document.getElementsByClassName("todo-edit-btn"));
    todoEditBtns.forEach((btn) => btn.addEventListener("click", (e) => {
        e.stopPropagation();

        btn.parentElement.classList.toggle("editing");

        const title = btn.parentElement.getElementsByClassName("todo-title")[0];
        const editTitle = btn.parentElement.getElementsByClassName("edit-todo-title")[0];

        const dueDate = btn.parentElement.getElementsByClassName("todo-due-date")[0];
        const editDueDate = btn.parentElement.getElementsByClassName("edit-todo-due-date")[0];

        const description = btn.parentElement.getElementsByClassName("todo-description")[0]
        const editDescription = btn.parentElement.getElementsByClassName("edit-todo-description")[0]

        // If "editing", update form values; else update data
        if (btn.parentElement.classList.contains("editing")) {
            editTitle.value = title.textContent;
            editDueDate.value = dueDate.textContent;
            editDescription.value = description.textContent;
            fitEditDescriptionFieldToContent(editDescription);

            // Expand the description so that the user can see the result after next action
            btn.parentElement.classList.add("expanded");
        } else {
            const newTitle = editTitle.value;
            const newDueDate = editDueDate.value;   // Format: yyyy-MM-dd - perfect for DOM
            const newDescription = editDescription.value;

            todoList.forEach((todo) => {
                if (todo.id === btn.parentElement.dataset.id) {
                    todo.title = newTitle;
                    todo.dueDate = parse(newDueDate, "yyyy-MM-dd", new Date());
                    todo.description = newDescription;
                }
            });

            title.textContent = newTitle;
            dueDate.textContent = newDueDate;
            description.textContent = newDescription;

        }
    }));

    const todoDeleteBtns = Array.from(document.getElementsByClassName("todo-delete-btn"));
    todoDeleteBtns.forEach((btn) => btn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTodo(createTodoFromDiv(btn.parentElement));
    }));

    const cancelEditBtns = Array.from(document.getElementsByClassName("cancel-edit-btn"));
    cancelEditBtns.forEach((btn) => btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.parentElement.classList.toggle("editing");
    }));
}

function reloadTodos() {
    switch (currentProject) {
        case "":
            switch (document.getElementById("project-title").textContent) {
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

    initContentBtns();
}

function initProjectBtn(btn) {
    btn.addEventListener("click", () => {
        currentProject = btn.textContent;
        showTodosForProject(todoList, currentProject);
        initContentBtns();
    });

    Array.from(btn.getElementsByClassName("delete-project-btn"))[0].addEventListener("click", (e) => {
        e.stopPropagation();

        todoList.forEach((todo) => {
            if (todo.project === btn.textContent) {
                deleteTodo(todo);
            }
        });
        btn.remove();
        
        if (btn.textContent === currentProject) {
            currentProject = "";
            reloadTodos();
        }
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

    const confirmProjectBtn = document.getElementById("confirm-project-btn");
    confirmProjectBtn.addEventListener("mousedown", (e) => {
        const addProjectTitle = document.getElementById("add-project-title");
        const addProjectErrorMsg = document.getElementById("add-project-error-msg");

        // Duplicates not allowed
        if (Array.from(document.getElementsByClassName("project-btn")).some((btn) => btn.textContent === addProjectTitle.value)) {
            addProjectErrorMsg.classList.remove("hidden"); 
            addProjectErrorMsg.textContent = "Please enter a unique title";
        } else if (addProjectTitle.value.trim()) {
            addProjectErrorMsg.classList.add("hidden");

            const newProjectBtn = document.createElement("button");
            newProjectBtn.classList.add("project-btn");

            const projectIcon = document.createElement("i");
            projectIcon.classList.add("fa-solid");
            projectIcon.classList.add("fa-list");

            const projectTitleSpan = document.createElement("span");
            projectTitleSpan.textContent = addProjectTitle.value;

            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid");
            deleteIcon.classList.add("fa-trash");
            deleteIcon.classList.add("delete-project-btn");

            newProjectBtn.appendChild(projectIcon);
            newProjectBtn.appendChild(projectTitleSpan);
            newProjectBtn.appendChild(deleteIcon);
            initProjectBtn(newProjectBtn);

            const btnContainer = Array.from(document.getElementsByClassName("btn-container")).at(-1);
            const addProjectContainer = document.getElementById("add-project-container");
            btnContainer.insertBefore(newProjectBtn, addProjectContainer);

            // Clear input
            addProjectTitle.value = "";

            // Whitespace only title not allowed
        } else {
            addProjectErrorMsg.classList.remove("hidden");
            addProjectErrorMsg.textContent = "Please enter a title";
            addProjectTitle.value = "";
        }
    });
}

function initBtns() {
    initSidebarBtns();
    initContentBtns();
}

let todoList = loadTodos();
initBtns();
let currentProject = "";
