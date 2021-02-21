function toDoFactory (title, dueDate, description = "") {
    let project = "default";
    let priority = "neutral"
    let finished = false;
    return {title, description, dueDate, priority, finished}
}

const sampleToDo = toDoFactory("test", "test", "test");

let toDoList = [];
export {toDoFactory, toDoList, sampleToDo};