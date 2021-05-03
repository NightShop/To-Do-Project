import "./style.css"

const body = document.querySelector("body");


//login form
const signInForm = document.getElementById("signInForm");

const usernameInput = document.createElement("input");
usernameInput.id = "usernameInput";
signInForm.appendChild(usernameInput);

const passwordInput = document.createElement("input");
passwordInput.id = "loginPasswordInput"
signInForm.appendChild(passwordInput);

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


signOutButton.onclick = () => {
    firebase.auth().signOut().then(() => console.log("User signed out"))
};

function authorizeUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(userCredential => {
        console.log("hello,", userCredential.user.email);
    }).catch(err => console.error(err.message));

}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        toDosTable.hidden = false;
        signInForm.hidden = true;
        userLogedIndicator.textContent = user.displayName;
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