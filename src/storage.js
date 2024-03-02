export default function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === "QuotaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
        );
    }
}

export function saveDataToLocalStorage(todos, projects, currentProject, currentView) {
    if (storageAvailable) {
        window.localStorage.setItem("todos", JSON.stringify(todos));
        window.localStorage.setItem("projects", JSON.stringify(projects));
        window.localStorage.setItem("currentProject", JSON.stringify(currentProject));
        window.localStorage.setItem("currentView", JSON.stringify(currentView));
    }
    console.log(window.localStorage);
}
