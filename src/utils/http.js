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
  if (response.status === 404) {
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
  if (response.status === 404) {
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

export async function getUserLogin(username) {
  const url = `${BASE_URL}users/get/${username}/`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  if (response.status === 401) {
    return response.status;
  }

  if (response.status === 403) {
    return response.status;
  }
  if (response.status === 404) {
    return response.status;
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



export async function getAllEnterprises() {
  const url = `${BASE_URL}enterprise/ad-ac-rh/`
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


export async function createEnterprise(enterpriseDto) {
  const url = `${BASE_URL}enterprise/ad/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(enterpriseDto)
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

export async function updateEnterprise({ slug, enterpriseDto }) {
  const url = `${BASE_URL}enterprise/ad/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(enterpriseDto)
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


export async function getEnterpriseById({ id, signal }) {
  const url = `${BASE_URL}enterprise/ad-ac-rh/get/${id}/`
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



export async function getEnterpriseBySlug({ slug, signal }) {
  const url = `${BASE_URL}enterprise/ad-ac-rh/${slug}/`
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


export async function getAllAgencies() {
  const url = `${BASE_URL}agency/ad-rh/`
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


export async function getAllAgenciesByEnterprise(enterprise) {
  const url = `${BASE_URL}agency/ad-ac-rh/get-enterprise/${enterprise}/`
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


export async function getAgencyById({ id, signal }) {
  const url = `${BASE_URL}agency/ad-ac-rh/get/${id}/`
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


export async function createAgency(agencyDto) {
  const url = `${BASE_URL}agency/ad/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(agencyDto)
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

export async function updateAgency({ slug, agencyDto }) {
  const url = `${BASE_URL}agency/ad/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(agencyDto)
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

export async function getAllSafes({ signal, enterprise, agency }) {
  const url = `${BASE_URL}safe/ad-ac/?enterprise=${enterprise}&agency=${agency}`
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


export async function getSafeById({ id, signal }) {
  const url = `${BASE_URL}safe/ad-ac/get/${id}/`
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

export async function createSafe(safeDto) {
  const url = `${BASE_URL}safe/ad-ac/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(safeDto)
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

export async function updateSafe({ slug, safeDto }) {
  const url = `${BASE_URL}safe/ad-ac/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(safeDto)
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


export async function getAllCashes({ signal, enterprise, agency }) {
  const url = `${BASE_URL}cash/ad-ac-rh/?enterprise=${enterprise}&agency=${agency}`
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


export async function createCash(cashDto) {
  const url = `${BASE_URL}cash/ac/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cashDto)
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


export async function getCashById({ id, signal }) {
  const url = `${BASE_URL}cash/ad-ac/get/${id}/`
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


export async function updateCash({ slug, cashDto }) {
  const url = `${BASE_URL}cash/ac/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cashDto)
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


export async function getAllBankAccount({ signal, agency }) {
  const url = `${BASE_URL}bank-account/ad-ac/?agency=${agency}`
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


export async function createBank(bankDto) {
  const url = `${BASE_URL}bank/ad/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bankDto)
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



export async function createBankAccount(bankAccountDto) {
  const url = `${BASE_URL}bank-account/ad-ac/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bankAccountDto)
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


export async function getAllBanks() {
  const url = `${BASE_URL}bank/ad-ac/`
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


export async function getBankAccountById({ id, signal }) {
  const url = `${BASE_URL}bank-account/ad-ac/get/${id}/`
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


export async function getBankById({ id, signal }) {
  const url = `${BASE_URL}bank/ad-ac/get/${id}/`
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


export async function updateBankAccount({ slug, bankAccountDto }) {
  const url = `${BASE_URL}bank-account/ad-ac/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bankAccountDto)
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



export async function updateBank({ slug, bankDto }) {
  const url = `${BASE_URL}bank/ad-ac/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bankDto)
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


export async function getAllOperators() {
  const url = `${BASE_URL}operator/ad-ac/`
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

export async function createOperator(operatorDto) {
  const url = `${BASE_URL}operator/ad/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(operatorDto)
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

export async function getOperatorById({ id, signal }) {
  const url = `${BASE_URL}operator/ad-ac/get/${id}/`
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


export async function updateOperator({ slug, operatorDto }) {
  const url = `${BASE_URL}operator/ad/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(operatorDto)
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

export async function getAllMobileMoney({ signal, agency }) {
  const url = `${BASE_URL}mobile-money/ad-ac/?agency=${agency}`
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


export async function createMobileMoney(mobileMoneyDto) {
  const url = `${BASE_URL}mobile-money/ad/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(mobileMoneyDto)
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


export async function getMobileMoneyById({ id, signal }) {
  const url = `${BASE_URL}mobile-money/ad-ac/get/${id}/`
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

export async function updateMobileMoney({ slug, mobileMoneyDto }) {
  const url = `${BASE_URL}mobile-money/ad/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(mobileMoneyDto)
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


export async function getAllStorePrincipal({ signal, agency }) {
  const url = `${BASE_URL}store-principal/ad-ac-ma/?agency=${agency}`
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



export async function createStorePrincipal(storePrincipalDto) {
  const url = `${BASE_URL}store-principal/ad/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storePrincipalDto)
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


export async function getStorePrincipalById({ id, signal }) {
  const url = `${BASE_URL}store-principal/ad-ac-ma/get/${id}/`
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



export async function updateStorePrincipal({ slug, storePrincipalDto }) {
  const url = `${BASE_URL}store-principal/ad/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storePrincipalDto)
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


export async function getAllAgenciesBankAuthorization({ signal, id }) {
  const url = `${BASE_URL}agency/ad/authorize-bank-agency/${id}`
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


export async function authorizeAgencyBank({ slug, rib }) {
  const url = `${BASE_URL}agency/ad/authorize-bank/${rib}/?slug=${slug}`
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

export async function unAuthorizeAgencyBank({ slug, rib }) {
  const url = `${BASE_URL}agency/ad/unauthorize-bank/${rib}/?slug=${slug}`
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



export async function getAllAgenciesMobileAuthorization({ signal, id }) {
  const url = `${BASE_URL}agency/ad/authorize-mobile-agency/${id}`
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



export async function authorizeAgencyMobile({ slug, identification }) {
  const url = `${BASE_URL}agency/ad/authorize-mobile-money/${identification}/?slug=${slug}`
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


export async function unAuthorizeAgencyMobileMoney({ slug, slugMobile }) {
  const url = `${BASE_URL}agency/ad/unauthorize-mobile-money/${slugMobile}/?slug=${slug}`
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



export async function getAllAgenciesStorePrincipalAuthorization({ signal, id }) {
  const url = `${BASE_URL}agency/ad/authorize-store-principal-agency/${id}`
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


export async function authorizeAgencyStorePrincipal({ slug, identification }) {
  const url = `${BASE_URL}agency/ad/authorize-store-principal/${identification}/?slug=${slug}`
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


export async function unAuthorizeAgencyStorePrincipal({ slug, slugStorePrincipal }) {
  const url = `${BASE_URL}agency/ad/unauthorize-store-principal/${slugStorePrincipal}/?slug=${slug}`
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


export async function getAllCashesSafeAuthorization({ signal, id }) {
  const url = `${BASE_URL}cash/ad-ac/authorize-safe-cash/${id}/`
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


export async function getAllCashesByAgency(agency) {
  const url = `${BASE_URL}cash/ad-ac/get-agency/${agency}/`
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



export async function authorizeCashSafe({ slug, slugSafe }) {
  const url = `${BASE_URL}cash/ac/authorize-safe/${slug}/?slugSafe=${slugSafe}`
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


export async function unAuthorizeCashSafe({ slug, slugSafe }) {
  const url = `${BASE_URL}cash/ac/unauthorize-safe/${slug}/?slugSafe=${slugSafe}`
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



export async function getAllTitles() {
  const url = `${BASE_URL}title/ad-rh/`
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


export async function createTitle(titleDto) {
  const url = `${BASE_URL}title/ad-rh/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(titleDto)
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


export async function getTitleById({ id, signal }) {
  const url = `${BASE_URL}title/ad-rh/get/${id}/`
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


export async function updateTitle({ slug, titleDto }) {
  const url = `${BASE_URL}title/rh/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(titleDto)
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


export async function createPersonal(personalDto) {
  const url = `${BASE_URL}personal/ad-rh/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(personalDto)
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


export async function getAllPersonals({ signal, enterprise, agency }) {
  const url = `${BASE_URL}personal/ad-rh/?enterprise=${enterprise}&agency=${agency}`
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


export async function getPersonalById({ id, signal }) {
  const url = `${BASE_URL}personal/all/get/${id}/`
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


export async function updatePersonal({ slug, personalDto }) {
  const url = `${BASE_URL}personal/rh/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(personalDto)
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


export async function getAllUsers({ signal, personals, enterprise, agency }) {
  const url = `${BASE_URL}users/ad-rh/?personals=${personals}&enterprise=${enterprise}&agency=${agency}`
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


export async function createUser(userDto) {
  const url = `${BASE_URL}users/ad-rh/create/`
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

export async function getUserById({ id, signal }) {
  const url = `${BASE_URL}users/ad-rh/get/${id}/`
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



export async function activateUser(username) {
  const url = `${BASE_URL}users/ad-rh/activate/${username}/`
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


export async function attributeRole({ username, attributeRoleDto }) {
  const url = `${BASE_URL}users/ad-rh/attribute-role/${username}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(attributeRoleDto)
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


export async function generateUUID() {
  const url = `${BASE_URL}uuid/`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
    const data = await response.text();
    return data;
  }
}



export async function reinitialize(username) {
  const url = `${BASE_URL}users/ad-rh/reinitialise/${username}/`
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


export async function affectEnterpriseToEnterprise({ slug, personalTransfertEnterpriseDto }) {
  const url = `${BASE_URL}personal/ad/transfer-to-enterprise/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(personalTransfertEnterpriseDto)
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


export async function affectAgencyToAgency({ slug, personalTransferAgencyDto }) {
  const url = `${BASE_URL}personal/rh/transfer-to-agency/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(personalTransferAgencyDto)
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


export async function authorizeCashPersonal({ slug, slugPersonal }) {
  const url = `${BASE_URL}cash/rh/authorize-personal/${slug}/?slugPersonal=${slugPersonal}`
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


export async function getAllCashesByPersonal(personal) {
  const url = `${BASE_URL}cash/all/${personal}/`
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



export async function getCategoryService() {
  const url = `${BASE_URL}category-service/ad-ac-ma-ca/`
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


export async function createCategoryService(categoryServiceDto) {
  const url = `${BASE_URL}category-service/ac-ma/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryServiceDto)
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


export async function getCategoryServiceById({ id, signal }) {
  const url = `${BASE_URL}category-service/ad-ac-ma-ca/get/${id}/`
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


export async function updateCategoryService({ slug, categoryServiceDto }) {
  const url = `${BASE_URL}category-service/ac-ma/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryServiceDto)
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


export async function getAllServices({ signal, enterprise }) {
  const url = `${BASE_URL}service/ad-ac-ma-cc-ca/?enterprise=${enterprise}`
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


export async function getServiceById({ signal, id }) {
  const url = `${BASE_URL}service/ad-ac-ma-cc-ca/get/${id}/`
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

export async function createService(serviceDto) {
  const url = `${BASE_URL}service/ac-ma/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceDto)
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


export async function updateService({ slug, serviceDto }) {
  const url = `${BASE_URL}service/ac-ma/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceDto)
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


export async function getAllProducts({ signal, enterprise }) {
  const url = `${BASE_URL}product/ad-ac-ma-cc-ca/?enterprise=${enterprise}`
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


export async function createProduct(productDto) {
  const url = `${BASE_URL}product/ac-ma/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productDto)
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


export async function getProductById({ signal, id }) {
  const url = `${BASE_URL}product/ad-ac-ma-cc-ca/get/${id}/`
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


export async function getProductBySlug({ signal, slug }) {
  const url = `${BASE_URL}product/ad-ac-ma-cc-ca/${slug}/`
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




export async function updateProduct({ slug, productDto }) {
  const url = `${BASE_URL}product/ac-ma/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productDto)
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

export async function getAllStores({ signal, enterprise, agency }) {
  const url = `${BASE_URL}store/ad-ac-ma-cc-ca/?enterprise=${enterprise}&agency=${agency}`
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


export async function createStore(storeDto) {
  const url = `${BASE_URL}store/ac-ma/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storeDto)
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



export async function getStoreById({ id, signal }) {
  const url = `${BASE_URL}store/ad-ac-ma/get/${id}/`
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



export async function updateStore({ slug, storeDto }) {
  const url = `${BASE_URL}store/ac-ma/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storeDto)
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


export async function getAllSpents() {
  const url = `${BASE_URL}spent/ad-ac/`
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



export async function getAllFamily() {
  const url = `${BASE_URL}spent-family/ad-ac/`
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



export async function createFamily(SpentFamilyDto) {
  const url = `${BASE_URL}spent-family/ad-ac/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(SpentFamilyDto)
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



export async function getSpentFamilyById({ id, signal }) {
  const url = `${BASE_URL}spent-family/ad-ac/get/${id}/`
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


export async function updateSpentFamily({ slug, spentFamilyDto }) {
  const url = `${BASE_URL}spent-family/ad-ac/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(spentFamilyDto)
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



export async function createSpent(spentDto) {
  const url = `${BASE_URL}spent/ad-ac/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(spentDto)
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


export async function getSpentById({ id, signal }) {
  const url = `${BASE_URL}spent/ad-ac/get/${id}/`
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


export async function updateSpent({ slug, spentDto }) {
  const url = `${BASE_URL}spent/ad-ac/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(spentDto)
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


export async function getAllBudgets({ signal, enterprise, agency }) {
  const url = `${BASE_URL}budget/ad-ac-cc-ca/?enterprise=${enterprise}&agency=${agency}`
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


export async function createBudget(budgetDto) {
  const url = `${BASE_URL}budget/ac/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(budgetDto)
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



export async function getBudgetById({ id, signal }) {
  const url = `${BASE_URL}budget/ad-ac-cc-ca/get/${id}/`
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


export async function updateBudget({ period, budgetDto }) {
  const url = `${BASE_URL}budget/ac/update/${period}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(budgetDto)
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


export async function validateAllBudget() {
  const url = `${BASE_URL}budget/ad/validate-all/`
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

export async function cleanAllBudget() {
  const url = `${BASE_URL}budget/ad/clean-all/`
  const token = getToken();
  const response = await fetch(url, {
    method: "DELETE",
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


export async function validateBudget(period) {
  const url = `${BASE_URL}budget/ad/validate/${period}/`
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


export async function getAllPurchaseOrders({ signal, enterprise, agency }) {
  const url = `${BASE_URL}purchase-order/ad-ac-ma/?enterprise=${enterprise}&agency=${agency}`
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


export async function getAllSuppliers({ signal, enterprise }) {
  const url = `${BASE_URL}supplier/ad-ac-ma/?enterprise=${enterprise}`
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



export async function createSupplier(supplierDto) {
  const url = `${BASE_URL}supplier/ad/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplierDto)
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



export async function updateSupplier({ slug, supplierDto }) {
  const url = `${BASE_URL}supplier/ad/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplierDto)
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


export async function getSupplierById({ id, signal }) {
  const url = `${BASE_URL}supplier/ad-ac-ma/get/${id}/`
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



export async function getAllEnterpriseSupplierAuthorization({ signal, id }) {
  const url = `${BASE_URL}enterprise/ad/authorize-supplier-enterprise/${id}/`
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



export async function authorizeEnterpriseSupplier({ slug, supplierAuthorizeEnterpriseDto }) {
  const url = `${BASE_URL}supplier/ad/authorize-enterprise/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplierAuthorizeEnterpriseDto)
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


export async function getAllSupplierAdvances({ signal, enterprise, agency }) {
  const url = `${BASE_URL}supplier-advance/ad-ac-ma-cc-ca/?enterprise=${enterprise}&agency=${agency}`
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



export async function createPurchaseOrder(purchaseOrderDto) {
  const url = `${BASE_URL}purchase-order/ac-ma/create/`
  const token = getToken();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(purchaseOrderDto)
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



export async function getPurchaseOrderById({ signal, id }) {
  const url = `${BASE_URL}purchase-order/ad-ac-ma/get/${id}/`
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


export async function updatePurchaseOrder({ slug, purchaseOrderDto }) {
  const url = `${BASE_URL}purchase-order/ac-ma/update/${slug}/`
  const token = getToken();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(purchaseOrderDto)
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


export async function annulationPurchaseOrder(slug) {
  const url = `${BASE_URL}purchase-order/ac-ma/annulation/${slug}/`
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