import { getUser } from "./api.js";

const loginForm = document.getElementById("login-form");
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");

const clearErrors = () => {
  document.querySelectorAll(".auth-error")?.forEach((el) => el.remove());
};

const showError = (error) => {
  clearErrors();
  const authError = document.createElement("p");
  authError.textContent = error;
  authError.classList.add("auth-error");
  loginForm.prepend(authError);
};

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = userEmail.value;
  const password = userPassword.value;

  if (email.trim() === "" || password.trim() === "") {
    showError("Email ou mot de passe manquant");
    return;
  }

  try {
    const user = await getUser(email, password);

    if (user?.token) {
      sessionStorage.setItem("token", user.token);
      window.location.href = "index.html";
    } else {
      showError("Une erreur est survenue");
    }
  } catch (error) {
    showError(error.message || "Une erreur est survenue");
  }
});
