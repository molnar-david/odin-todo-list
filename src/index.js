import TodoList from './todo-list.js';

let todoList = new TodoList("title");
todoList.addTodo(new Todo("title", "description", "dueDate", "priority"));
console.log(todoList.todos[0].description);
