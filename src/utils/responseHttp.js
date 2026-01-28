export default function responseHttp(response) {
  let state = false;
  const tab = ["Utilisateur non authentifié",
    "Vous n'êtes pas autorisé à effectuer cette opération",
    "Impossible de recupérer les donnéees",
    "Votre requête n'a pas pas abouti",
    "Cette opération n'a pas pu se terminée"]

  if (typeof (response) === "object") {
    response.forEach(r => {
      if (tab.includes(r)) {
        state = true;
      }
    })
  } else if (typeof (response) === "string") {
    if (!response.includes("succès")) {
      state = true;
    }
  }

  return state;
}