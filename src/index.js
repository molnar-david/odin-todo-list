import { parse } from 'date-fns';
import { min } from 'date-fns/min'
import Todo from './todo.js'
import loadData, { showAndReturnTodo, showAllTodos, showTodosToday, showTodosThisWeek, showTodosForProject, reloadTodos } from './ui.js';
import { saveDataToLocalStorage } from './storage.js';

function deleteTodo(todo) {
    const todoDivs = Array.from(document.getElementsByClassName("todo"));

    let foundTodoDiv = false;
    todoDivs.forEach((todoDiv) =>  {
        if (foundTodoDiv) {
            todoDiv.dataset.id = (parseInt(todoDiv.dataset.id) - 1).toString();
        } else if (todoDiv.dataset.id === todo.id) {
            foundTodoDiv = true;
            todoDiv.remove();

            let foundTodo = false;
            for (let i = 0; i < todoList.length; i++) {
                if (todoList[i].id === todo.id && !foundTodo) {
                    foundTodo = true;
                    todoList.splice(i, 1);
                }

                if (foundTodo && i < todoList.length) {
                    todoList[i].id = (parseInt(todoList[i].id) - 1).toString();
                }
            }
        }
    });

    saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
}

function initContentBtn(btn) {
    function fitTodoEditDescriptionFieldToContent (field) {
        field.style.height = "auto"
        field.style.height = Math.min(field.scrollHeight, 240) + "px";
    }
    
    // Clicking anywhere on the div toggles the checkmark - clicking on checkbox is not necessary
    btn.addEventListener("click", () => {
        btn.classList.toggle("checked");
    
        // Toggle "checked" on the class represantation as well
        todoList.forEach((todoItem) => {
            if (todoItem.id === btn.dataset.id) {
                todoItem.toggleChecked();
            }
        });

        saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
    });

    const todoDetailsBtn = Array.from(btn.getElementsByClassName("todo-details-btn"))[0];
    todoDetailsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.classList.toggle("expanded");
    });

    // Make sure edit fields work as intended, clicking on them won't toggle "checked" state
    const todoEditTitle = Array.from(btn.getElementsByClassName("todo-edit-title"))[0];
    todoEditTitle.addEventListener("click", (e) => e.stopPropagation());
    
    const todoEditDueDate = Array.from(btn.getElementsByClassName("todo-edit-due-date"))[0];
    todoEditDueDate.addEventListener("click", (e) => e.stopPropagation());

    const todoEditDescription = Array.from(btn.getElementsByClassName("todo-edit-description"))[0];
    todoEditDescription.addEventListener("click", (e) => e.stopPropagation());

    // Make sure todoEditDescription is sized properly for any reasonable action
    todoEditDescription.addEventListener("keydown", () => fitTodoEditDescriptionFieldToContent(todoEditDescription));
    todoEditDescription.addEventListener("keyup", () => fitTodoEditDescriptionFieldToContent(todoEditDescription));
    todoEditDescription.addEventListener("change", () => fitTodoEditDescriptionFieldToContent(todoEditDescription));

    const todoEditBtn = Array.from(btn.getElementsByClassName("todo-edit-btn"))[0];
    todoEditBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        btn.classList.toggle("editing");

        const title = btn.getElementsByClassName("todo-title")[0];
        const editTitle = btn.getElementsByClassName("todo-edit-title")[0];

        const dueDate = btn.getElementsByClassName("todo-due-date")[0];
        const editDueDate = btn.getElementsByClassName("todo-edit-due-date")[0];

        const description = btn.getElementsByClassName("todo-description")[0]
        const editDescription = btn.getElementsByClassName("todo-edit-description")[0]

        // If "editing", update form values; else update data
        if (btn.classList.contains("editing")) {
            btn.classList.add("expanded");
            editTitle.value = title.textContent;
            editDueDate.value = dueDate.textContent;
            editDescription.value = description.textContent;
            fitTodoEditDescriptionFieldToContent(editDescription);
        } else {
            const newTitle = editTitle.value;
            const newDueDate = editDueDate.value;   // Format: yyyy-MM-dd - perfect for DOM
            const newDescription = editDescription.value;

            todoList.forEach((todo) => {
                if (todo.id === btn.dataset.id) {
                    todo.title = newTitle;
                    todo.dueDate = parse(newDueDate, "yyyyyy-MM-dd", new Date());
                    todo.description = newDescription;
                }
            });

            title.textContent = newTitle;
            dueDate.textContent = newDueDate;
            description.textContent = newDescription;

            saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
        }
    });

    const todoDeleteBtn = Array.from(btn.getElementsByClassName("todo-delete-btn"))[0];
    todoDeleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTodo(Todo.fromDiv(btn));
    });

    const todoCancelEditBtn = Array.from(btn.getElementsByClassName("todo-cancel-edit-btn"))[0];
    todoCancelEditBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.classList.toggle("editing");
    });
}

function initContentBtns() {

    let todos = Array.from(document.getElementsByClassName("todo"));
    todos.forEach((todo) => initContentBtn(todo));
}

function initProjectBtn(btn) {
    btn.addEventListener("click", () => {
        currentProject = btn.textContent;
        showTodosForProject(todoList, currentProject);
        initContentBtns();
        saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
    });

    Array.from(btn.getElementsByClassName("project-delete-btn"))[0].addEventListener("click", (e) => {
        e.stopPropagation();

        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].project === btn.textContent) {
                deleteTodo(todoList[i]);
                i--;
            }
        };
        btn.remove();
        
        if (btn.textContent === currentProject) {
            currentProject = "";
            currentView = "All";
            reloadTodos(todoList, currentProject, currentView);
            initContentBtns();
        }

        projectList.splice(projectList.indexOf(btn.textContent), 1);
        saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
    });
}

function addProject() {
    const projectAddTitle = document.getElementById("project-add-title");
    const projectAddErrorMsg = document.getElementById("project-add-error-msg");

    // Duplicates not allowed
    if (Array.from(document.getElementsByClassName("project-btn")).some((btn) => btn.textContent === projectAddTitle.value)) {
        projectAddErrorMsg.classList.remove("hidden"); 
        projectAddErrorMsg.textContent = "Please enter a unique title";
    } else if (projectAddTitle.value.trim()) {
        projectAddErrorMsg.classList.add("hidden");

        const newProjectBtn = document.createElement("button");
        newProjectBtn.classList.add("project-btn");

        const projectIcon = document.createElement("i");
        projectIcon.classList.add("fa-solid");
        projectIcon.classList.add("fa-list");

        const projectTitleSpan = document.createElement("span");
        projectTitleSpan.textContent = projectAddTitle.value;

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid");
        deleteIcon.classList.add("fa-trash");
        deleteIcon.classList.add("project-delete-btn");

        newProjectBtn.appendChild(projectIcon);
        newProjectBtn.appendChild(projectTitleSpan);
        newProjectBtn.appendChild(deleteIcon);
        initProjectBtn(newProjectBtn);

        const btnContainer = Array.from(document.getElementsByClassName("btn-container")).at(-1);
        const projectAddContainer = document.getElementById("project-add-container");
        btnContainer.insertBefore(newProjectBtn, projectAddContainer);

        projectList.push(projectAddTitle.value);
        saveDataToLocalStorage(todoList, projectList, currentProject, currentView);

        // Clear input
        projectAddTitle.value = "";

        // Whitespace only title not allowed
    } else {
        projectAddErrorMsg.classList.remove("hidden");
        projectAddErrorMsg.textContent = "Please enter a title";
        projectAddTitle.value = "";
    }

    // Focus on the add title input even when the confirm button is pressed
    setTimeout(() => projectAddTitle.focus(), 0);
}

function initSidebarBtns() {
    const allBtn = document.getElementById("all-btn");
    allBtn.addEventListener("click", () => {
        currentProject = "";
        currentView = "All";
        showAllTodos(todoList);
        initContentBtns();
        saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
    });

    const todayBtn = document.getElementById("today-btn");
    todayBtn.addEventListener("click", () => {
        currentProject = "";
        currentView = "Today";
        showTodosToday(todoList);
        initContentBtns();
        saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
    });

    const weekBtn = document.getElementById("week-btn");
    weekBtn.addEventListener("click", () => {
        currentProject = "";
        currentView = "This week";
        showTodosThisWeek(todoList)
        initContentBtns();
        saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
    });

    const projectBtns = Array.from(document.getElementsByClassName("project-btn"));
    projectBtns.forEach((btn) => initProjectBtn(btn));
}

function initSidebarForm() {
    const confirmProjectBtn = document.getElementById("confirm-project-btn");
    confirmProjectBtn.addEventListener("mousedown", (e) => addProject());

    // Allow project to be added by pressing "Enter"
    const projectAddTitle = document.getElementById("project-add-title");
    projectAddTitle.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addProject();
    });
}

function initContentForm() {
    const todoAddBtn = document.getElementById("todo-add-btn");
    todoAddBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const todoAddTitle = document.getElementById("todo-add-title");
        const newTodoTitle = todoAddTitle.value;

        const todoAddDescription = document.getElementById("todo-add-description")
        const newTodoDescription = todoAddDescription.value;

        const todoAddDueDate = document.getElementById("todo-add-due-date");
        let newTodoDueDate;
        if (todoAddDueDate.value) {
            newTodoDueDate = parse(todoAddDueDate.value, "yyyyyy-MM-dd", new Date());
        }
        let newTodoPriority;

        let todoAddPriority;
        const todoAddPriorities = Array.from(document.querySelectorAll("input[name=todo-add-priority"));
        todoAddPriorities.forEach((priority) => {
            if (priority.checked) {
                newTodoPriority = priority.value;
                todoAddPriority = priority;
            }
        });

        const newTodoChecked = false;
        const newtodoProject = currentProject;

        let newTodoId;
        if (todoList.length) {
            newTodoId = (parseInt(todoList.at(-1).id)+ 1).toString();
        } else {
            newTodoId = "0";
        }

        const todoAddErrorMsg = document.getElementById("todo-add-error-msg");
        if (newTodoTitle && newTodoDueDate && newTodoPriority) {
            const newTodo = new Todo(newTodoTitle, newTodoDescription, newTodoDueDate, newTodoPriority, newTodoChecked, newtodoProject, newTodoId);
            todoList.push(newTodo);
            initContentBtn(showAndReturnTodo(newTodo));
            todoAddErrorMsg.classList.add("hidden");

            todoAddTitle.value = "";
            todoAddDescription.value = "";
            todoAddDueDate.value = "";
            todoAddPriority.checked = false;

            saveDataToLocalStorage(todoList, projectList, currentProject, currentView);
        } else {
            todoAddErrorMsg.classList.remove("hidden");
        }
    });
}

function initBtns() {
    initSidebarBtns();
    initContentBtns();
    initSidebarForm();
    initContentForm();
}

let todoList = [];
let projectList = [];
let currentProject = "";
let currentView = "All";
[currentProject, currentView] = loadData(todoList, projectList);
initBtns();
