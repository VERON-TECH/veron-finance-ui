export const features = [
  { key: 0, menu: "Administration", role: ["ROLE_ADMIN"], path: "" },
  { key: 1, menu: "Finances", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], path: "financial" },
  { key: 2, menu: "Gestion Budgétaire", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], path: "budgets" },
  { key: 3, menu: "Ressources Humaines", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"], path: "ressources-human" },
  { key: 4, menu: "Dashboard", role: ["ROLE_ADMIN"], path: "reporting" },
  { key: 5, menu: "Caisses", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"], path: "cash" },
  { key: 6, menu: "Ventes", role: ["ROLE_CAISSIER"], path: "sale" },
  { key: 7, menu: "Magasins & Stocks", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"], path: "stores" },
  { key: 8, menu: "Appro & transferts", role: ["ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"], path: "mvt-stock" },
  { key: 9, menu: "Autres réglages", role: ["ROLE_ADMIN"], path: "setting" },
  { key: 10, menu: "Base de données", role: ["ROLE_ADMIN"], path: "data" },
]

export const subFeactures = [
  { key: 0, menu: "Entreprise", identifier: "administration", url: "enterprise", role: ["ROLE_ADMIN"] },
  { key: 1, menu: "Agences", identifier: "administration", url: "agency", role: ["ROLE_ADMIN"] },
  { key: 2, menu: "Coffre-forts", identifier: "financial", url: "safe", role: ["ROLE_COMPTABLE"] },
  { key: 3, menu: "Caisses", identifier: "financial", url: "cash", role: ["ROLE_COMPTABLE"] },
  { key: 4, menu: "Banques", identifier: "financial", url: "bank-account", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 5, menu: "Mobile Money", identifier: "financial", url: "mobile-money", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 6, menu: "Magasins principaux", identifier: "store", url: "store-principal", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 7, menu: "Magasins sécondaires", identifier: "store", url: "store", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 8, menu: "Fournisseurs", identifier: "store", url: "supplier", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 9, menu: "Produits & Services", identifier: "store", url: "product-service", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 10, menu: "Stock", identifier: "store", url: "product-stock", role: ["ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 11, menu: "Bons de commande", identifier: "stock", url: "purchase-order", role: ["ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 12, menu: "Appro & Transferts", identifier: "stock", url: "mvt-stock", role: ["ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 13, menu: "Fournitures", identifier: "stock", url: "supplies", role: ["ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 14, menu: "Rébuts", identifier: "stock", url: "rebuts", role: ["ROLE_COMPTABLE", "ROLE_COMPTABLE_MATIERE"] },
  { key: 15, menu: "Personnels", identifier: "personal", url: "personal", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"] },
  { key: 16, menu: "Utilisateurs", identifier: "personal", url: "user", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"] },
  { key: 17, menu: "Dépenses", identifier: "budget", url: "spent", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 18, menu: "Budgets", identifier: "budget", url: "budget", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },

]








