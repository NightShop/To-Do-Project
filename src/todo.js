import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZa30_Gm9gIayy9dBkFKZalL1Nq-W1sso",
    authDomain: "to-do-list-exercise-93187.firebaseapp.com",
    projectId: "to-do-list-exercise-93187",
    storageBucket: "to-do-list-exercise-93187.appspot.com",
    messagingSenderId: "179254968178",
    appId: "1:179254968178:web:34d372e20bbd00e711e7eb"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

function toDoFactory(id, title, dueDate, description = "") {
    let priority = "neutral"
    let finished = false;


    function getId() {
        return id;
    }

    function toggleCompleted() {
        console.log(this.finished);
        if (this.finished === false) {
            this.finished = true;
        }
        else {
            this.finished = false;
        }

    }

    return { title, description, dueDate, priority, finished, getId, toggleCompleted }
}

async function parseCloudStorage() {

    let newToDoList = [];

    await db.collection("toDos").get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
            const toDoFetch = doc.data();
            let newToDo = toDoFactory(doc.id);
            for (const [key, value] of Object.entries(toDoFetch)) {
                newToDo[key] = value;
            }
            console.log(newToDo);
            newToDoList.push(newToDo);
        })
    })

    return newToDoList;
}

function saveToCloud(toDo) {
    const id = toDo.getId();
    db.collection("toDos").doc(id).set({
        description: toDo.description,
        dueDate: toDo.dueDate,
        finished: toDo.finished,
        priority: toDo.priority,
        title: toDo.title,
    });
}

async function getToDoFromCloud(id) {
    return await db.collection("toDos").doc(id).get().then(doc => {
        let toDoFetch = doc.data();
        let newToDo = toDoFactory(doc.id);
        for (const [key, value] of Object.entries(toDoFetch)) {
            newToDo[key] = value;
        }
        return newToDo;
    });
}

export { toDoFactory, parseCloudStorage, saveToCloud, getToDoFromCloud };