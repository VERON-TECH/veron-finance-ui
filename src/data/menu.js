export const features = [
  { key: 0, menu: "Administration", role: ["ROLE_ADMIN"], path: "" },
  { key: 1, menu: "Finances", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], path: "financial" },
  { key: 2, menu: "Ressources Humaines", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"], path: "human" },
  { key: 3, menu: "Dashboard", role: ["ROLE_ADMIN"], path: "reporting" },
  { key: 4, menu: "Caisses", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"], path: "cash" },
  { key: 5, menu: "Ventes", role: ["ROLE_CAISSIER"], path: "sale" },
  { key: 6, menu: "Magasins", role: ["ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"], path: "store" },
  { key: 7, menu: "Autres réglages", role: ["ROLE_ADMIN"], path: "setting" },
  { key: 8, menu: "Base de données", role: ["ROLE_ADMIN"], path: "data" },
]

export const subFeactures = [
  { key: 0, menu: "Entreprise", identifier: "administration", url: "enterprise", role: ["ROLE_ADMIN"] },
  { key: 1, menu: "Agences", identifier: "administration", url: "agency", role: ["ROLE_ADMIN"] },
  { key: 2, menu: "Coffre-forts", identifier: "financial", url: "safe", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 3, menu: "Caisses", identifier: "financial", url: "cash", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 4, menu: "Banques", identifier: "financial", url: "bank-account", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 5, menu: "Mobile Money", identifier: "financial", url: "mobile-money", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
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

