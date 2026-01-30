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
  const url = `${BASE_URL}enterprise/ad/`
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
  const url = `${BASE_URL}enterprise/ad/get/${id}/`
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
  const url = `${BASE_URL}agency/ad-ac/`
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
  const url = `${BASE_URL}agency/ad-ac/get-enterprise/${enterprise}/`
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
  const url = `${BASE_URL}agency/ad-ac/get/${id}/`
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

export async function getAllSafes() {
  const url = `${BASE_URL}safe/ad-ac/`
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


export async function getAllCashes() {
  const url = `${BASE_URL}cash/ad-ac/`
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


export async function createCash(cashDto) {
  const url = `${BASE_URL}cash/ad-ac/create/`
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
  const url = `${BASE_URL}cash/ad-ac/update/${slug}/`
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


export async function getAllBankAccount() {
  const url = `${BASE_URL}bank-account/ad-ac/`
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


export async function createBank(bankDto) {
  const url = `${BASE_URL}bank/ad-ac/create/`
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

export async function getAllMobileMoney() {
  const url = `${BASE_URL}mobile-money/ad-ac/`
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
