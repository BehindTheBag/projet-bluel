const urlLogin = "http://localhost:5678/api/users/login";

document.getElementById("loginform").addEventListener("submit", submitLogin);

async function submitLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = {
    email: email,
    password: password,
  };

  const response = await fetch(urlLogin, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (response.status !== 200) {
    showError("L'e-mail ou le mot de passe est incorrecte.");
    return;
  }

  const result = await response.json();
  const token = result.token;

  sessionStorage.setItem("userToken", token);
  window.location.href = "index.html";
}

function showError(message) {
  const existingError = document.querySelector(".error-login");
  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-login";
  errorDiv.textContent = message;

  const passwordField = document.getElementById("password");
  passwordField.parentNode.insertBefore(errorDiv, passwordField.nextSibling);
}
