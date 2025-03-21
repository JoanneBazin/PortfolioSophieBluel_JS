const getToken = () => sessionStorage.getItem("token");

export const getUser = async (email, password) => {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Erreur dans l’identifiant ou le mot de passe");
    }
    throw new Error(`Erreur lors de l'authentification`);
  }
  return await response.json();
};
export const getWorks = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Erreur lors de la récupération : ${response.status}`);
  }
};
export const getCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Erreur lors de la récupération : ${response.status}`);
  }
};
export const addWork = async (formData) => {
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Erreur lors de l'ajout' : ${response.status}`);
  }
};
export const removeWork = async (workId) => {
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression' : ${response.status}`);
  }
};
