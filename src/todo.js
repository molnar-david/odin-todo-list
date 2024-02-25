export default class Todo {
    #title;
    #description;
    #dueDate;
    #priority;
    #checked;

    constructor(title, description, dueDate, priority, checked = false){
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#checked = checked;
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

    toggleChecked() {
        this.#checked = !this.#checked
    }
}
