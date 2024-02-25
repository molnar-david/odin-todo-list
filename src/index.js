import Todo from './todo.js';
import TodoList from './todo-list.js';

let todoList = new TodoList("title");
todoList.addTodo(new Todo("title", "description", "dueDate", "priority"));
console.log(todoList.deleteAndReturnTodo(todoList.todos[0]));
