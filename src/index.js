import { toDoFactory, toDoList } from "./todo.js";
import { dom } from "./dom.js";

const newTask = toDoFactory("get groceries", "02/05/2021", "in mercator");
const newTaskTwo = toDoFactory("get cable", "05/08/2021", "in merkur");
toDoList.push(newTask);
toDoList.push(newTaskTwo);

console.log(dom);

const container = document.querySelector(".container");
container.append(dom.refreshTable());

const newToDoButton = document.querySelector("#createNewToDo");
newToDoButton.addEventListener("click", () => {
    const table = document.querySelector("table");
    const formCreate = dom.createToDoForm();
    table.appendChild(formCreate);
});

console.log(toDoList);


