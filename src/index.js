import Todo from './todo.js';
import TodoList from './todo-list.js';

let todoList = new TodoList("title");
todoList.addTodo(new Todo("title", "description", "dueDate", "priority"));
console.log(todoList.popTodo(todoList.todos[0]));
