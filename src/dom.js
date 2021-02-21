import { columnsTable } from "./config.js";
import { toDoList, toDoFactory, sampleToDo } from "./todo.js"
const dom = (function () {
    function createTable() {
        const table = document.createElement("table");
        const caption = document.createElement("caption");
        const headerRow = document.createElement("tr");
        const headerColumns = [];
        columnsTable.forEach(element => {
            const column = document.createElement("th");
            const columnName = element[0].toUpperCase() + element.slice(1);
            column.textContent = columnName;
            headerColumns.push(column);
        });

        console.log(toDoList);
        headerRow.append(...headerColumns);
        table.append(caption, headerRow);

        toDoList.forEach(toDo => {
            table.appendChild(createRow(toDo));
        });
        return table;
    }

    function createToDoForm() {
        const createForm = document.createElement("tbody");
        createForm.classList.add("createForm");

        const topFormRow = document.createElement("tr");
        const bottomFormRow = document.createElement("tr");

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.setAttribute("id", "saveButton")
        saveButton.addEventListener("click", () => { 
            const newToDo = getToDoFromInput();
            toDoList.push(newToDo);
            createRow(newToDo);
            const table = document.querySelector("table");
            table.appendChild(createRow(newToDo));
            deleteForm();
            
        });

        const descriptionInput = document.createElement("input");
        descriptionInput.setAttribute("id", "descriptionInput");
        descriptionInput.defaultValue = "enter description";

        const bottomRowCell = document.createElement("td");
        bottomRowCell.classList.add("bottomRowCell");
        bottomRowCell.setAttribute("colspan", `${columnsTable.length}`);
        bottomRowCell.append(saveButton, descriptionInput);

        const headerColumns = [];
        columnsTable.forEach(element => {
            const column = document.createElement("th");
            const inputField = document.createElement("input");
            inputField.setAttribute("id", element);
            inputField.defaultValue = element;
            column.appendChild(inputField);
            headerColumns.push(column);
        });



        topFormRow.append(...headerColumns);

        bottomFormRow.append(bottomRowCell);
        
        createForm.append(topFormRow, bottomFormRow);
        return createForm;
    }

    function getToDoFromInput () {
        let dataObj = {};
        columnsTable.forEach((property) => {
            const inputData = document.querySelector(`#${property}`);
            dataObj[property] = inputData.value;
        });

        let description = document.querySelector("#descriptionInput");

        let newToDo = toDoFactory(dataObj["title"], dataObj["dueDate"], description.value);


        return newToDo;
    }

    function deleteForm () {
        const form = document.querySelector(".createForm");
        form.remove();
    }


    function createRow(toDo) {
        const row = document.createElement("tr");

        columnsTable.forEach(columnName => {
            const singleCell = document.createElement("td");
            singleCell.textContent = toDo[columnName];
            row.appendChild(singleCell);
        });

        return row;
    }


    return { createTable, createToDoForm };
})();


export { dom };