import { parse } from 'date-fns';
import { min } from 'date-fns/min'
import Todo from './todo.js'
import loadTodos, { showAndReturnTodo, showAllTodos, showTodosToday, showTodosThisWeek, showTodosForProject } from './ui.js';

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
        }
    });

    const todoDeleteBtn = Array.from(btn.getElementsByClassName("todo-delete-btn"))[0];
    todoDeleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTodo(Todo.createTodoFromDiv(btn));
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

function addProject() {
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

    // Focus on the add title input even when the confirm button is pressed
    setTimeout(() => addProjectTitle.focus(), 0);
}

function initSidebarBtns() {
    const allBtn = document.getElementById("all-btn");
    allBtn.addEventListener("click", () => {
        currentProject = "";
        showAllTodos(todoList);
        initContentBtns();
    });

    const todayBtn = document.getElementById("today-btn");
    todayBtn.addEventListener("click", () => {
        currentProject = "";
        showTodosToday(todoList);
        initContentBtns();
    });

    const weekBtn = document.getElementById("week-btn");
    weekBtn.addEventListener("click", () => {
        currentProject = "";
        showTodosThisWeek(todoList)
        initContentBtns();
    });

    const projectBtns = Array.from(document.getElementsByClassName("project-btn"));
    projectBtns.forEach((btn) => initProjectBtn(btn));
}

function initSidebarForm() {
    const confirmProjectBtn = document.getElementById("confirm-project-btn");
    confirmProjectBtn.addEventListener("mousedown", (e) => addProject());

    // Allow project to be added by pressing "Enter"
    const addProjectTitle = document.getElementById("add-project-title");
    addProjectTitle.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addProject();
    });
}

function initContentForm() {
    const addTodoBtn = document.getElementById("add-todo-btn");
    addTodoBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const newTodoTitle = document.getElementById("add-todo-title").value;
        const newTodoDescription = document.getElementById("add-todo-description").value;

        let newTodoDueDate;
        if (document.getElementById("add-todo-due-date").value) {
            newTodoDueDate = parse(document.getElementById("add-todo-due-date").value, "yyyyyy-MM-dd", new Date());
        }
        let newTodoPriority;

        const addTodoPriorities = Array.from(document.querySelectorAll("input[name=add-todo-priority"));
        addTodoPriorities.forEach((priority) => {
            if (priority.checked) newTodoPriority = priority.value;
        });

        const newTodoChecked = false;
        const newtodoProject = currentProject;

        let newTodoId;
        if (todoList.length) {
            newTodoId = parseInt(todoList.at(-1).id)+ 1;
        } else {
            newTodoId = 0;
        }

        const addTodoErrorMsg = document.getElementById("add-todo-error-msg");
        if (newTodoTitle && newTodoDueDate && newTodoPriority) {
            const newTodo = new Todo(newTodoTitle, newTodoDescription, newTodoDueDate, newTodoPriority, newTodoChecked, newtodoProject, newTodoId);
            todoList.push(newTodo);
            initContentBtn(showAndReturnTodo(newTodo));
            addTodoErrorMsg.classList.add("hidden");
        } else {
            addTodoErrorMsg.classList.remove("hidden");
        }
    });
}

function initBtns() {
    initSidebarBtns();
    initContentBtns();
    initSidebarForm();
    initContentForm();
}

let todoList = loadTodos();
initBtns();
let currentProject = "";
