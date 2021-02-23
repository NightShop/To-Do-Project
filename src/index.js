import { toDoFactory, toDoList, setLocalStorage, parseLocalStorage } from "./todo.js";
import { dom } from "./dom.js";

/* const newTask = toDoFactory("get groceries", "02/05/2021", "in mercator");
newTask.category = "coding";
const newTaskTwo = toDoFactory("get cable", "05/08/2021", "in merkur");
newTaskTwo.category = "social";
const newTaskThree = toDoFactory("get sweets", "55/58/2023", "in gmajna");
newTaskThree.category = "social";

 toDoList.push(newTask);
toDoList.push(newTaskTwo);
toDoList.push(newTaskThree);

setLocalStorage(toDoList); */

window.addEventListener("beforeunload", () => {
    setLocalStorage(toDoList);
    return false;
});





toDoList.push(...parseLocalStorage());

const container = document.querySelector(".container");
container.append(dom.refreshTable());

const newToDoButton = document.querySelector("#createNewToDo");
newToDoButton.addEventListener("click", () => {
    const table = document.querySelector("table");
    const formCreate = dom.createToDoForm();
    table.appendChild(formCreate);
});

const codingFilterButton = document.querySelector("#coding");
codingFilterButton.addEventListener("click", () => {
    container.append(dom.refreshTable("coding"));
});

const sportFilterButton = document.querySelector("#sport");
sportFilterButton.addEventListener("click", () => {
    container.append(dom.refreshTable("sport"));
});

const socialFilterButton = document.querySelector("#social");
socialFilterButton.addEventListener("click", () => {
    container.append(dom.refreshTable("social"));
});

const allFilterButton = document.querySelector("#all");
allFilterButton.addEventListener("click", () => {
    container.append(dom.refreshTable());
});





