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

const sampleToDo = toDoFactory("test", "test", "test");


let toDoList = [];
export {toDoFactory, toDoList, sampleToDo};