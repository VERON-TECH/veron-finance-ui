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

