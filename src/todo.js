function toDoFactory (title, dueDate, description = "") {
    let project = "default";
    let priority = "neutral"
    let finished = false;
    const id = Math.floor(Date.now() * Math.random());

    function getId() {
        return id;
    }

    function toggleCompleted () {
        console.log(this.finished);
        if(this.finished === false) {
            this.finished = true;
        }
        else {
            this.finished = false;
        }

    }


    return {title, description, dueDate, priority, finished, getId, toggleCompleted}
}


function setLocalStorage(toDoList) {
    localStorage.setItem("toDoList", JSON.stringify(toDoList));
}

function parseLocalStorage() {
    let tempToDo = JSON.parse(localStorage.getItem("toDoList"));
    let newToDoList = [];
    tempToDo.forEach(toDo => {
        let newToDo = toDoFactory();
        
        for(const [key, value] of Object.entries(toDo)) {
            newToDo[key] = value;
        }
        newToDoList.push(newToDo);
    });
    console.log(newToDoList);
    return newToDoList;
}

const sampleToDo = toDoFactory("test", "test", "test");


let toDoList = [];
export {toDoFactory, toDoList, setLocalStorage, parseLocalStorage};