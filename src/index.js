import "./style.css"

const usernameInput = document.createElement("input");
usernameInput.id = "loginPasswordInput";
const passwordInput = document.createElement("input");
passwordInput.id = "loginPasswordInput"
const signInButton = document.createElement("button");
signInButton.id = "signInButton";
signInButton.textContent = "Sign In";

const signInForm = document.getElementById("signInForm");
signInForm.appendChild(usernameInput);
signInForm.appendChild(passwordInput);
signInForm.appendChild(signInButton);