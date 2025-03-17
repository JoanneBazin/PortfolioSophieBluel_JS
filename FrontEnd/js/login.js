import { getUser } from "./api.js";

const loginForm = document.getElementById("login-form");
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = userEmail.value;
  const password = userPassword.value;

  document.querySelector(".auth-error")?.remove();

  try {
    const user = await getUser(email, password);

    if (user?.token) {
      sessionStorage.setItem("token", user.token);
      window.location.href = "index.html";
    }
  } catch (error) {
    const authError = document.createElement("p");
    authError.textContent = error.message;
    authError.classList.add("auth-error");
    loginForm.prepend(authError);
  }
});
