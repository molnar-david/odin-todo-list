export default class Todo {
    #title;
    #description;
    #dueDate;
    #priority;
    #checked;
    #project;
    #index;

    constructor(title, description, dueDate, priority, checked, project, index){
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#checked = checked;
        this.#project = project;
        this.#index = index;
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

    get index() {
        return this.#index;
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

    set index(newIndex) {
        this.#index = newIndex;
    }

    toggleChecked() {
        this.#checked = !this.#checked
    }
}
