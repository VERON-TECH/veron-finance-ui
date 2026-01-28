export const features = [
  { key: 0, menu: "Administration", role: ["ROLE_ADMIN"], path: "" },
  { key: 1, menu: "Finance", role: ["ROLE_ADMIN", "ROLE_AGENT"], path: "projects" },
  { key: 2, menu: "Stock", role: ["ROLE_ADMIN", "ROLE_SUPERADMIN", "ROLE_AGENT"], path: "human" },
  { key: 3, menu: "Ressource humaine", role: ["ROLE_SUPERADMIN"], path: "data" },

]

export const subFeactures = [
  { key: 0, menu: "Utilisateurs", identifier: "users", url: "users", role: ["ROLE_SUPERADMIN", "ROLE_ADMIN"] },
  { key: 1, menu: "Importations", identifier: "bdd", url: "import", role: ["ROLE_SUPERADMIN"] },
  { key: 2, menu: "Bénéficiaire", identifier: "beneficiary", url: "beneficiary", role: ["ROLE_ADMIN", "ROLE_AGENT"] },
  { key: 3, menu: "Segments", identifier: "project", url: "project", role: ["ROLE_ADMIN", "ROLE_AGENT"] },
  { key: 4, menu: "Financements", identifier: "project", url: "finance", role: ["ROLE_ADMIN", "ROLE_AGENT"] },
  { key: 5, menu: "Mot de passe", identifier: "users", url: "password", role: ["ROLE_SUPERADMIN", "ROLE_AGENT", "ROLE_ADMIN"] },
]









export const user = {
  header: [
    { key: 0, header: "id", field: "id" },
    { key: 1, header: "Ref.", field: "refUsers" },
    { key: 2, header: "Login", field: "username" },
    { key: 3, header: "Nom complet", field: "fullName" },
    { key: 4, header: "E-mail", field: "email" },
    { key: 5, header: "Tél.", field: "phone" },
    { key: 6, header: "Connecté?", field: "connected" },
    { key: 7, header: "Actif", field: "enabled" },
    { key: 8, header: "Connexion", field: "connexion" },
    { key: 9, header: "Rôle", field: "role" },
    { key: 10, header: "Créé le:", field: "dateCreation" },
    { key: 11, header: "Créé par:", field: "userCreated" },
  ],



  global: [
    "id",
    "Ref.",
    "Login",
    "Nom complet",
    "E-mail",
    "Tél.",
    "Connecté?",
    "Actif",
    "Connexion",
    "Rôle",
    "Créé par:",
    "Créé le:",
  ]

}


export const roles = [
  { key: 0, name: "ADMIN", value: "ROLE_ADMIN" },
  { key: 1, name: "AGENT", value: "ROLE_AGENT" },

]



export const beneficiary = {
  header: [
    { key: 0, header: "id", field: "id" },
    { key: 1, header: "Ref.", field: "refBeneficiary" },
    { key: 2, header: "Type", field: "type" },
    { key: 3, header: "Catégorie", field: "category" },
    { key: 4, header: "Nom", field: "lastName" },
    { key: 5, header: "Prénom", field: "firstName" },
    { key: 6, header: "Tél.", field: "phone" },
    { key: 7, header: "Tél2.", field: "phone2" },
    { key: 8, header: "E-mail", field: "email" },
    { key: 9, header: "Pays", field: "country" },
    { key: 10, header: "Région", field: "state" },
    { key: 11, header: "Ville", field: "city" },
    { key: 12, header: "Addresse", field: "address" },
    { key: 13, header: "Genre", field: "gender" },
    { key: 14, header: "Nº C.N.I.", field: "idCard" },
    { key: 15, header: "Date de délivrance", field: "dateObtention" },
    { key: 16, header: "Lieu de délivrance", field: "placeObtention" },
    { key: 17, header: "Délivrée par", field: "commissaire" },
    { key: 18, header: "Crée le", field: "dateCreation" },
    { key: 19, header: "Crée par", field: "userCreated" },
  ],



  global: [
    "id",
    "Ref.",
    "Type",
    "Catégorie",
    "Nom",
    "Prénom",
    "Tél.",
    "Tél2.",
    "E-mail",
    "Pays",
    "Région",
    "Ville",
    "Addresse",
    "Genre",
    "Date de délivrance",
    "Lieu de délivrance",
    "Délivrée par",
    "Crée le",
    "Crée par",
  ]

}


export const project = {

  header: [
    { key: 0, header: "id", field: "id" },
    { key: 1, header: "Ref.", field: "refProject" },
    { key: 2, header: "Nom", field: "name" },
    { key: 3, header: "Domaine", field: "domain" },
    { key: 4, header: "Type d'activité", field: "activity" },
    { key: 5, header: "Créé le", field: "dateCreation" },
    { key: 6, header: "Créé par", field: "userCreated" },

  ],



  global: [
    "id",
    "Ref.",
    "Nom",
    "Domaine",
    "Type d'activité",
    "Crée le",
    "Crée par",
  ]

}





export const finances = {

  header: [
    { key: 0, header: "id", field: "id" },
    { key: 1, header: "N.U.I.", field: "nui" },
    { key: 2, header: "Segment", field: "project" },
    { key: 3, header: "ID bénéficiaire", field: "beneficiary" },
    { key: 3, header: "Nom complet", field: "fullName" },
    { key: 4, header: "Domaine", field: "domain" },
    { key: 5, header: "Activité", field: "activity" },
    { key: 6, header: "Créé le", field: "dateCreation" },
    { key: 7, header: "Créé par", field: "userCreated" },

  ],



  global: [
    "id",
    "N.U.I.",
    "Segment",
    "ID bénéficiaire",
    "Nom complet",
    "Domaine",
    "Activité",
    "Crée le",
    "Crée par",
  ]

}

