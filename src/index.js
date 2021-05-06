import "./style.css"
import { format } from 'date-fns';

let toDosRef = firebase.firestore().collection("toDos");

let unsubscribe;

//login form
const signInForm = document.getElementById("signInForm");

const usernameInput = document.createElement("input");
usernameInput.id = "usernameInput";
signInForm.appendChild(usernameInput);

const passwordInput = document.createElement("input");
passwordInput.id = "loginPasswordInput"
signInForm.appendChild(passwordInput);

const signInButton = document.createElement("button");
signInButton.id = "signInButton";
signInButton.textContent = "Sign In";
signInButton.addEventListener("click", (ev) => {
    const email = (ev.target.parentElement.querySelector("#usernameInput").value);
    const password = (ev.target.parentElement.querySelector("#loginPasswordInput").value);
    authorizeUser(email, password);
});
signInForm.appendChild(signInButton);

const signInWithGoogleButton = document.createElement("button");
signInWithGoogleButton.textContent = "Sign in with Google";

var providerGoogle = new firebase.auth.GoogleAuthProvider();
signInWithGoogleButton.onclick = () => {
    firebase.auth().signInWithPopup(providerGoogle);
}
signInForm.appendChild(signInWithGoogleButton);

//CreateToDoForm manipulations
const createToDoFormSection = document.getElementById("createToDoForm");

const showCreateToDoForm = document.getElementById("showNewToDoForm");
showCreateToDoForm.onclick = (ev) => {
    ev.preventDefault();
    createToDoFormSection.hidden = false;
}

const closeCreateToDoForm = document.getElementById("closeNewToDo");
closeCreateToDoForm.onclick = (ev) => {
    ev.preventDefault();
    toDoTitleInput.value = "";
    dueDateInput.value = "";
    categoryInput.value = "";
    createToDoFormSection.hidden = true;
    toDoIDInput.value = "";
}

const toDoTitleInput = document.getElementById("toDoTitle");
const dueDateInput = document.getElementById("dueDateInput");
const categoryInput = document.getElementById("categoryInput");
const toDoIDInput = document.getElementById("toDoUpdateID");

const saveToDoButton = document.getElementById("saveToDo");
saveToDoButton.onclick = (ev) => {
    if (ev.target.parentElement.checkValidity()) {
        ev.preventDefault();
        console.log(dueDateInput.value)
        saveToFirebase();
        toDoIDInput.value = "";
        toDoTitleInput.value = "";
        dueDateInput.value = "";
        categoryInput.value = "";
    }
}

const saveToFirebase = () => {
    if (firebase.auth().currentUser) {
        const id = toDoIDInput.value;
        if (id === "") {
            toDosRef.add({
                uid: firebase.auth().currentUser.uid,
                title: toDoTitleInput.value,
                dueDate: dueDateInput.value,
                category: categoryInput.value,
                completed: false,
                createdAt: Date.now(),
            });
        } else {
            toDosRef.doc(id).update({
                uid: firebase.auth().currentUser.uid,
                title: toDoTitleInput.value,
                dueDate: dueDateInput.value,
                category: categoryInput.value,
                completed: false,
                createdAt: Date.now(),
            })
            toDoIDInput.value = "";
            saveToDoButton.textContent = "Add";
        }
    }

}


//filter manipulations
const filterIndicator = document.getElementById("filterIndicator");
const allFilterButton = document.getElementById("allFilter");
const codingFilterButton = document.getElementById("codingFilter");
const sportFilterButton = document.getElementById("sportFilter");
const socialFilterButton = document.getElementById("socialFilter");

allFilterButton.addEventListener("click", (ev) => changeFilter(ev));
codingFilterButton.addEventListener("click", (ev) => changeFilter(ev));
sportFilterButton.addEventListener("click", (ev) => changeFilter(ev));
socialFilterButton.addEventListener("click", (ev) => changeFilter(ev));

const changeFilter = (ev) => {
    const filterString = ev.target.id.slice(0, -6);
    filterIndicator.setAttribute("data-id", filterString);
    filterIndicator.textContent = filterString[0].toUpperCase() + filterString.slice(1);
    const user = firebase.auth().currentUser;
    if (filterString != "all") {
        if (user) {
            toDosRef
                .where("uid", "==", user.uid)
                .where("category", "==", filterString)
                .orderBy("completed")
                .orderBy("createdAt", "desc")
                .get().then(querySnapshot => {
                    toDoRows.innerHTML = "";
                    querySnapshot.docs.forEach(doc => {
                        const newRow = createRowElement(doc.data().title, doc.data().dueDate, doc.data().category, doc.data().completed, doc.id);
                        const filter = filterIndicator.getAttribute("data-id");
                        console.log(filter);
                        newRow.onclick = () => {
                            const isCompleted = !doc.data().completed;
                            toDosRef.doc(doc.id).update({
                                completed: isCompleted,
                            })

                            console.log("in on click filter");
                        }
                        toDoRows.appendChild(
                            newRow
                        );
                    })



                })
        }
    } else {
        if (user) {
            toDosRef
                .where("uid", "==", user.uid)
                .orderBy("completed")
                .orderBy("createdAt", "desc")
                .get().then(querySnapshot => {
                    toDoRows.innerHTML = "";
                    querySnapshot.docs.forEach(doc => {
                        const newRow = createRowElement(doc.data().title, doc.data().dueDate, doc.data().category, doc.data().completed, doc.id);
                        const filter = filterIndicator.getAttribute("data-id");
                        console.log(filter);
                        newRow.onclick = () => {
                            const isCompleted = !doc.data().completed;
                            toDosRef.doc(doc.id).update({
                                completed: isCompleted,
                            })

                            console.log("in on click filter");
                        }
                        toDoRows.appendChild(
                            newRow
                        );
                    })



                })
        }
    }
}


//selected dom elements
const toDosTable = document.getElementById("toDosTable");
const userLogedIndicator = document.getElementById("userLogedIndicator");
userLogedIndicator.textContent = "false";
const signOutButton = document.getElementById("signOutButton");
const toDoRows = document.getElementById("toDosRows");


signOutButton.onclick = () => {
    firebase.auth().signOut().then(() => console.log("User signed out"))
};

function authorizeUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(userCredential => {
        console.log("hello,", userCredential.user.email);
    }).catch(err => console.error(err.message));

}

function createRowElement(title, dueDate, category, completed, id) {
    const row = document.createElement("tr");
    completed ? row.classList.add("completed") : row.classList.remove("completed");
    row.setAttribute("data-id", id);

    const titleElement = document.createElement("td");
    titleElement.textContent = title;
    row.appendChild(titleElement);

    let formatedDate;
    const dueDateElement = document.createElement("td");
    if (dueDate != "") {
        const dueDateElement = document.createElement("td");
        const dates = dueDate.split("-");
        dates[1] = parseInt(dates[1], 10) - 1;
        formatedDate = format(new Date(dates[0], dates[1], dates[2]), "dd-MMM");
        console.log(dueDateElement);
    }
    dueDateElement.textContent = formatedDate;
    row.appendChild(dueDateElement);

    const categoryElement = document.createElement("td");
    categoryElement.textContent = category;
    row.appendChild(categoryElement);

    const completedElement = document.createElement("td");
    completedElement.textContent = completed;
    row.appendChild(completedElement);

    const trashButton = document.createElement("td");
    trashButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    trashButton.onclick = (ev) => {
        ev.stopPropagation();
        toDosRef.doc(id).delete();
        toDoIDInput.value = "";
        toDoTitleInput.value = "";
        dueDateInput.value = "";
        categoryInput.value = "";

    }
    row.appendChild(trashButton);

    const editButton = document.createElement("td");
    editButton.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
    editButton.onclick = (ev) => {
        ev.stopPropagation();
        createToDoFormSection.hidden = false;
        fillAddForm(title, dueDate, category, id);
    }
    row.appendChild(editButton);


    return row;
}

function fillAddForm(title, dueDate, category, id) {
    toDoTitleInput.value = title;
    dueDateInput.value = dueDate;
    categoryInput.value = category;
    saveToDoButton.textContent = "Update";
    toDoIDInput.value = id;

}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        toDosTable.hidden = false;
        signInForm.hidden = true;
        userLogedIndicator.textContent = user.displayName;
        unsubscribe = toDosRef
            .where("uid", "==", user.uid)
            .orderBy("completed")
            .orderBy("createdAt", "desc")
            .onSnapshot(querySnapshot => {

                toDoRows.innerHTML = "";
                querySnapshot.docs.forEach(doc => {
                    const filterString = filterIndicator.getAttribute("data-id");
                    const newRow = createRowElement(doc.data().title, doc.data().dueDate, doc.data().category, doc.data().completed, doc.id);
                    newRow.onclick = () => {
                        const isCompleted = !doc.data().completed
                        toDosRef.doc(doc.id).update({
                            completed: isCompleted,
                        })
                    }
                    console.log("im here", filterString);
                    if (filterString == "all") {
                        toDoRows.appendChild(newRow);
                    }
                    else if (filterString == doc.data().category) {
                        toDoRows.appendChild(newRow);
                    }

                })



            })


    } else {
        userLogedIndicator.textContent = "false";
        toDosTable.hidden = true;
        signInForm.hidden = false;
        unsubscribe && unsubscribe();
    }
})


/* THIS IS FOR TESTING
function updateUsername(username) {
    var user = firebase.auth().currentUser;
    if (username !== "") {
        user.updateProfile({
            displayName: username,
        }).then(() => userLogedIndicator.textContent = username)
    }
} */