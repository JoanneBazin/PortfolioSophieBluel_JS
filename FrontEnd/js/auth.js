const logButton = document.getElementById("login-nav");

// Handle user's authentication status
export const isAdmin = () => sessionStorage.getItem("token") !== null;

export const updateNavButton = () => {
  if (isAdmin()) {
    logButton.textContent = "logout";
    logButton.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      document.body.classList.remove("edit-body");
      window.location.reload();
    });
  } else {
    logButton.textContent = "login";
    logButton.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
};
