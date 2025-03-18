const logButton = document.getElementById("login-nav");

// Handle user's authentication status
export const isAdmin = () => Boolean(sessionStorage.getItem("token"));

export const updateNavButton = () => {
  logButton.removeEventListener("click", handleAuth);

  logButton.textContent = isAdmin() ? "logout" : "login";
  logButton.addEventListener("click", handleAuth);
};

const handleAuth = () => {
  if (isAdmin()) {
    sessionStorage.removeItem("token");
    document.body.classList.remove("edit-body");
    window.location.reload();
  } else {
    window.location.href = "login.html";
  }
};
