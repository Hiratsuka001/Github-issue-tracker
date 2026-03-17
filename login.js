const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

form.onsubmit = function () {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username === "admin" && password === "admin123") {
    window.location.href = "main.html";
    return false;
  } else {
    alert("Wrong username or password! Try: admin / admin123");
    return false;
  }
};
