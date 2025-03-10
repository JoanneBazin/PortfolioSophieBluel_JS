const loginForm = document.getElementById("login-form");
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = userEmail.value;
  const password = userPassword.value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (response.ok) {
      sessionStorage.setItem("token", result.token);
      window.location.href = "index.html";
    } else {
      let existingError = document.querySelector(".auth-error");
      if (!existingError) {
        const authError = document.createElement("p");
        authError.textContent = "Erreur dans l’identifiant ou le mot de passe";
        authError.classList.add("auth-error");
        loginForm.prepend(authError);
      } else return;
    }
  } catch (error) {
    console.log(error);
    alert("Erreur lors de la connexion");
  }
});
