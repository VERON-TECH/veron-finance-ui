export const features = [
  { key: 0, menu: "Administration", role: ["ROLE_ADMIN"], path: "" },
  { key: 1, menu: "Finances", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], path: "financial" },
  { key: 2, menu: "Ressources Humaines", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"], path: "ressources-human" },
  { key: 3, menu: "Dashboard", role: ["ROLE_ADMIN"], path: "reporting" },
  { key: 4, menu: "Caisses", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"], path: "cash" },
  { key: 5, menu: "Ventes", role: ["ROLE_CAISSIER"], path: "sale" },
  { key: 6, menu: "Magasins & Stocks", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"], path: "stores" },
  { key: 7, menu: "Autres réglages", role: ["ROLE_ADMIN"], path: "setting" },
  { key: 8, menu: "Base de données", role: ["ROLE_ADMIN"], path: "data" },
]

export const subFeactures = [
  { key: 0, menu: "Entreprise", identifier: "administration", url: "enterprise", role: ["ROLE_ADMIN"] },
  { key: 1, menu: "Agences", identifier: "administration", url: "agency", role: ["ROLE_ADMIN"] },
  { key: 2, menu: "Coffre-forts", identifier: "financial", url: "safe", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 3, menu: "Caisses", identifier: "financial", url: "cash", role: ["ROLE_COMPTABLE"] },
  { key: 4, menu: "Banques", identifier: "financial", url: "bank-account", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 5, menu: "Mobile Money", identifier: "financial", url: "mobile-money", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 6, menu: "Magasins principaux", identifier: "store", url: "store-principal", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 7, menu: "Produits & Services", identifier: "store", url: "product-service", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 8, menu: "Personnels", identifier: "personal", url: "personal", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"] },
  { key: 9, menu: "Utilisateurs", identifier: "personal", url: "user", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"] },

]








