import { QueryClient } from "@tanstack/react-query";
import getToken from "./token";

export const queryClient = new QueryClient();
const BASE_URL = "http://localhost:8095/";

export async function login(data) {
  const url = `${BASE_URL}users/login/`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)

  })

  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const token = response.headers.get("Authorization");
    if (token) {
      localStorage.setItem("token", token.replace("Bearer ", ""));
    }
  }


}


export async function connected(username) {
  const url = `${BASE_URL}users/connected/${username}/`
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const token = response.headers.get("Authorization");
    if (token) {
      localStorage.setItem("token", token.replace("Bearer ", ""));
    }
  }

}


export async function getUser(username) {
  const url = `${BASE_URL}users/get/${username}/`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getAuthoritiByUsername(username) {
  const url = `${BASE_URL}authority/get/${username}/`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function getAuthorityByUsername(username) {
  const url = `${BASE_URL}authority/get/${username}/`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}




export async function logout(username) {
  const url = `${BASE_URL}users/logout/${username}/`
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function editPassword(username, userEditPasswordDto) {
  const url = `${BASE_URL}users/edit-password/${username}/`
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userEditPasswordDto)
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function getUsersAdmin() {
  const url = `${BASE_URL}/users/super-admin/get-all-admin`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response.status === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getAllUsers() {
  const url = `${BASE_URL}/users/admin/get-all`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response.status === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function getUserById({ signal, id }) {
  if (id === undefined || id === "") {
    return;
  }
  const url = `${BASE_URL}/users/super-admin-admin/get-id?id=${id}`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response.status === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function addUser(userDto) {

  const user = JSON.parse(localStorage.getItem("user"))
  let word = "super-admin/create-admin"
  if (!user.role.includes("ROLE_SUPERADMIN")) {
    word = "admin/create"
  }
  const url = `${BASE_URL}/users/${word}`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userDto)
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function editUser(userEditDto) {
  const url = `${BASE_URL}/users/super-admin-admin/edit`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userEditDto)
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function activateUser({ refUsers, enabled }) {
  const url = `${BASE_URL}/users/admin/activate?refUsers=${refUsers}&enabled=${enabled}`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function reinitialise({ refUsers }) {

  const url = `${BASE_URL}/users/super-admin-admin/reinitialise?refUsers=${refUsers}`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function getAllBeneficiary() {
  const url = `${BASE_URL}/beneficiary/admin-agent/get-all`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}




export async function addBeneficiary(beneficiaryDto) {
  const url = `${BASE_URL}/beneficiary/agent/create`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(beneficiaryDto)
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function editBeneficiary({ id, beneficiaryDto }) {
  const url = `${BASE_URL}/beneficiary/agent/edit?id=${id}`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(beneficiaryDto)
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getBeneficiaryById({ signal, id }) {
  const url = `${BASE_URL}/beneficiary/admin-agent/get?id=${id}`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getAllProjects() {
  const url = `${BASE_URL}/projects/admin-agent/get-all`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function addProject(projectDto) {
  const url = `${BASE_URL}/projects/agent/create`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectDto)
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function getProjectById({ signal, id }) {
  const url = `${BASE_URL}/projects/admin-agent/get?id=${id}`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function editProject({ id, projectDto }) {
  const url = `${BASE_URL}/projects/agent/edit?id=${id}`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectDto)
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}



export async function addBenficiaryToProject({ refProject, refBeneficiary }) {
  const url = `${BASE_URL}/project-attribution/agent/add-beneficiary?refProject=${refProject}&refBeneficiary=${refBeneficiary}`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getAllFinancements() {
  const url = `${BASE_URL}/project-attribution/admin-agent/get-all`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getAllFinancementsByBeneficiary({ beneficiary }) {
  const url = `${BASE_URL}/project-attribution/admin-agent-beneficiary/get-all-beneficiary?beneficiary=${beneficiary}`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getAllBeneficiriesByProject({ signal, id }) {
  const url = `${BASE_URL}/beneficiary/admin-agent/get-project?id=${id}`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getAllProjectsByBeneficiary({ signal, id }) {
  const url = `${BASE_URL}/projects/admin-agent/get-beneficiary?id=${id}`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function getProjectAttributionById({ signal, id }) {
  const url = `${BASE_URL}/project-attribution/admin-agent/get?id=${id}`
  const token = getToken();
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}


export async function uploadEntities({ criteria, formData }) {

  let info;
  switch (criteria) {
    case "beneficiary":
      info = "beneficiary"
      break;
  }
  const url = `${BASE_URL}/upload/super/${info}`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (response.status === 401) {
    return ["Utilisateur non authentifié"];
  }

  if (response.status === 403) {
    return ["Vous n'êtes pas autorisé à effectuer cette opération"];
  }
  if (response === 404) {
    return ["Impossible de recupérer les données"];
  }

  if (!response.ok) {
    return ["Votre requête n'a pas pas abouti"];
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
}






