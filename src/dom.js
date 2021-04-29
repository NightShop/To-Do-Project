import { columnsTable } from "./config.js";
import { toDoFactory, saveToCloud, getToDoFromCloud, deleteToDoCloud } from "./todo.js"
import uniqid from "uniqid";
const dom = (function () {


    function refreshTable(toDoList, category = "") {
        const oldTable = document.querySelector("table");
        if (oldTable) {
            oldTable.remove()
        }
        let filteredToDoList = [...toDoList];

        if (category != "") {
            let categoryFilter = category;
            filteredToDoList = toDoList.filter(toDo => toDo.category == categoryFilter)
        }
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
        const buttonsColumn = document.createElement("th");
        headerColumns.push(buttonsColumn);


        headerRow.append(...headerColumns);
        table.append(caption, headerRow);

        filteredToDoList.forEach(toDo => {
            table.appendChild(createRow(toDo));
        });
        return table;
    }

    function createToDoForm(toDoId = "") {
        const createForm = document.createElement("tbody");
        createForm.classList.add("createForm");

        const topFormRow = document.createElement("tr");
        const bottomFormRow = document.createElement("tr");

        const descriptionInput = document.createElement("input");
        descriptionInput.setAttribute("id", "descriptionInput");
        descriptionInput.defaultValue = "enter description";


        const headerColumns = [];

        let toDo;

        if (toDoId != "") {
            getToDoFromCloud(toDoId).then(toDo => {
                descriptionInput.value = toDo.description;

                columnsTable.forEach(element => {
                    const column = document.createElement("td");
                    const inputField = document.createElement("input");
                    inputField.setAttribute("id", element);
                    inputField.defaultValue = toDo[element];
                    column.appendChild(inputField);
                    headerColumns.push(column);
                });
                for (let i = headerColumns.length - 1; i >= 0; i--) {
                    topFormRow.insertBefore(headerColumns[i], topFormRow.firstChild)
                }
                return toDo
            }).then(toDoData => toDo = toDoData);

        }

        else {
            columnsTable.forEach(element => {
                const column = document.createElement("td");
                const inputField = document.createElement("input");
                inputField.setAttribute("id", element);
                inputField.defaultValue = element;
                column.appendChild(inputField);
                headerColumns.push(column);
            });
            topFormRow.append(...headerColumns);
        }



        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.setAttribute("id", "saveButton")
        saveButton.addEventListener("click", () => {

            const newToDo = getToDoFromInput();

            const table = document.querySelector("table");
            const newRow = createRow(newToDo);

            if (toDo != undefined) {
                const nextSiblingg = document.querySelector(".createForm").nextElementSibling;
                table.insertBefore(newRow, nextSiblingg);
                saveToCloud(newToDo);
            }
            else {
                table.appendChild(newRow);
                saveToCloud(newToDo);
            }
            deleteForm();
        });

        const bottomRowCell = document.createElement("td");
        bottomRowCell.classList.add("bottomRowCell");
        bottomRowCell.setAttribute("colspan", `${columnsTable.length}`);
        bottomRowCell.append(descriptionInput);



        topFormRow.append(saveButton);
        bottomFormRow.append(bottomRowCell);
        createForm.append(topFormRow, bottomFormRow);
        return createForm;
    }

    function getToDoFromInput() {
        let dataObj = {};

        const formBody = document.querySelector(".createForm");
        const id = formBody.getAttribute("data-id");

        columnsTable.forEach((property) => {
            const inputData = document.querySelector(`#${property}`);
            dataObj[property] = inputData.value;
        });

        let description = document.querySelector("#descriptionInput");
        dataObj["description"] = description.value;
        let newToDo;
        /* toDoList.some(toDo => toDo.getId() == id) */
        if (false) {
            newToDo = toDoList.find(toDo => toDo.getId() == id);
            newToDo.title = dataObj["title"];
            newToDo.description = dataObj["description"];
            newToDo.dueDate = dataObj["dueDate"];
            newToDo.category = dataObj["category"];
        }
        else {
            newToDo = toDoFactory(uniqid(), dataObj["title"], dataObj["dueDate"], dataObj["description"]);
            newToDo.category = dataObj["category"];

        }





        return newToDo;
    }

    function deleteForm() {
        const form = document.querySelector(".createForm");
        form.remove();
    }


    function createRow(toDo) {
        const row = document.createElement("tr");
        row.setAttribute("id", toDo.getId());
        columnsTable.forEach(columnName => {
            const singleCell = document.createElement("td");
            singleCell.textContent = toDo[columnName];
            row.appendChild(singleCell);
        });

        //create buttons
        const buttonsCell = document.createElement("td");

        const completedButton = document.createElement("button");
        completedButton.setAttribute("id", "completedButton");
        completedButton.setAttribute("data-id", toDo.getId());
        completedButton.textContent = "completed";
        completedButton.addEventListener("click", elem => callChangeCompleted(elem));
        buttonsCell.appendChild(completedButton);

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("id", "deleteButton");
        deleteButton.setAttribute("data-id", toDo.getId());
        deleteButton.textContent = "delete";
        deleteButton.addEventListener("click", elem => {
            deleteToDo(elem);
            deleteToDoCloud(toDo.getId());
        });
        buttonsCell.appendChild(deleteButton);

        const editButton = document.createElement("button");
        editButton.setAttribute("id", "editButton");
        editButton.setAttribute("data-id", toDo.getId());
        editButton.textContent = "edit";
        editButton.addEventListener("click", elem => {
            const id = elem.target.getAttribute("data-id");
            const formCreate = createToDoForm(id);
            const table = document.querySelector("table");
            table.replaceChild(formCreate, editButton.parentElement.parentElement);


        });
        buttonsCell.appendChild(editButton);

        row.appendChild(buttonsCell);

        return row;
    }

    function callChangeCompleted(elem) {
        const id = elem.target.getAttribute("data-id");
        const toDo = toDoList.find(toDo => {
            return toDo.getId() == id;
        });

        const index = toDoList.findIndex(toDo => {
            return toDo.getId() == id;
        });

        toDo.toggleCompleted();
        toDoList[index] = toDo;

        const container = document.querySelector(".container");
        container.append(dom.refreshTable());
    }

    function deleteToDo(elem) {
        const id = elem.target.getAttribute("data-id");


        
        const container = document.querySelector(".container");
        container.append(dom.refreshTable());
    }

    return { refreshTable, createToDoForm };
})();


export { dom };