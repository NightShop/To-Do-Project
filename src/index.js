import "./style.css"

const body = document.querySelector("body");

let toDosRef;
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
}

const toDoTitleInput = document.getElementById("toDoTitle");
const dueDateInput = document.getElementById("dueDateInput");
const categoryInput = document.getElementById("categoryInput");

const saveToDoButton = document.getElementById("saveToDo");
saveToDoButton.onclick = (ev) => {
    ev.preventDefault();
    if (firebase.auth().currentUser) {
        toDosRef.add({
            uid: firebase.auth().currentUser.uid,
            title: toDoTitleInput.value,
            dueDate: dueDateInput.value,
            category: categoryInput.value,
        })
    }

    toDoTitleInput.value = "";
    dueDateInput.value = "";
    categoryInput.value = "";
}

/* THIS IS FOR TESTING
//testing username
const usernameUpdateInput = document.createElement("input");
usernameUpdateInput.id = "loginusernameUpdate"
const updateUsernameButton = document.createElement("button");
updateUsernameButton.textContent = "Update Username";
updateUsernameButton.onclick = () => {
    updateUsername(usernameUpdateInput.value);
}
const updateDiv = document.createElement("div");
updateDiv.appendChild(usernameUpdateInput);
updateDiv.appendChild(updateUsernameButton);
body.appendChild(updateDiv);
 */





//test button
const testButton = document.createElement("button");
testButton.textContent = "Test"
testButton.onclick = () => {
}
signInForm.appendChild(testButton);


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

function createRowElement(title, dueDate, category) {
    const row = document.createElement("tr");

    const titleElement = document.createElement("td");
    titleElement.textContent = title;
    row.appendChild(titleElement);
    
    const dueDateElement = document.createElement("td");
    dueDateElement.textContent = dueDate;
    row.appendChild(dueDateElement);

    const categoryElement = document.createElement("td");
    categoryElement.textContent = category;
    row.appendChild(categoryElement);

    const completedElement = document.createElement("td");
    completedElement.textContent = "false";
    row.appendChild(completedElement);

    return row;
}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {


        toDosTable.hidden = false;
        signInForm.hidden = true;
        userLogedIndicator.textContent = user.displayName;
        toDosRef = firebase.firestore().collection("toDos");

        unsubscribe = toDosRef
            .where("uid", "==", user.uid)
            .onSnapshot(querySnapshot => {
                toDoRows.innerHTML = "";
                querySnapshot.docs.forEach(doc => {
                    toDoRows.appendChild(createRowElement(doc.data().title, doc.data().dueDate, doc.data().category));
                })

                

            })
    } else {
        userLogedIndicator.textContent = "false";
        toDosTable.hidden = true;
        signInForm.hidden = false;
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