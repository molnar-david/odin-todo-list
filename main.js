(()=>{"use strict";let t=new class{#t;#e=[];constructor(t){this.#t=t}get title(){return this.#t}get todos(){return this.#e}addTodo(t){this.#e.push(t)}deleteAndReturnTodo(t){return this.#e.splice(this.#e.indexOf(t),1)}}("title");t.addTodo(new class{#t;#i;#s;#o;#r;constructor(t,e,i,s,o=!1){this.#t=t,this.#i=e,this.#s=i,this.#o=s,this.#r=o}get title(){return this.#t}get description(){return this.#i}get dueDate(){return this.#s}get priority(){return this.#o}get checked(){return this.#r}set title(t){this.#t=t}set description(t){this.#i=t}set dueDate(t){this.#s=t}set priority(t){this.#o=t}toggleChecked(){this.#r=!this.#r}}("title","description","dueDate","priority")),console.log(t.deleteAndReturnTodo(t.todos[0]))})();