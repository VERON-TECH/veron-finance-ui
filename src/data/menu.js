export const features = [
  { key: 0, menu: "Administration", role: ["ROLE_ADMIN"], path: "" },
  { key: 1, menu: "Finances", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], path: "bank-account" },
  { key: 2, menu: "Gestion Budgétaire", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], path: "spent" },
  { key: 3, menu: "Ressources Humaines", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"], path: "personal" },
  { key: 4, menu: "Dashboard", role: ["ROLE_ADMIN"], path: "day" },
  { key: 5, menu: "Ventes", role: ["ROLE_CAISSIER"], path: "sale" },
  { key: 6, menu: "Caisses", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"], path: "mvt-cash" },
  { key: 7, menu: "Magasins & Stocks", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], path: "store-principal" },
  { key: 8, menu: "Appro & transferts", role: ["ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], path: "mvt-stock" },
  { key: 9, menu: "Engagements", role: ["ROLE_COMPTABLE", "ROLE_ADMIN"], path: "engagement" },
  { key: 10, menu: "Autres réglages", role: ["ROLE_ADMIN"], path: "print" },
  { key: 11, menu: "Banques", role: ["ROLE_CHEF_CAISSIER"], path: "mvt-bank" },
  { key: 12, menu: "Données", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], path: "data" },

]

export const subFeactures = [
  { key: 0, menu: "Entreprise", identifier: "administration", url: "enterprise", role: ["ROLE_ADMIN"] },
  { key: 1, menu: "Agences", identifier: "administration", url: "agency", role: ["ROLE_ADMIN"] },
  { key: 2, menu: "Coffre-forts", identifier: "financial", url: "safe", role: ["ROLE_COMPTABLE"] },
  { key: 3, menu: "Caisses", identifier: "financial", url: "cash", role: ["ROLE_COMPTABLE"] },
  { key: 4, menu: "Banques", identifier: "financial", url: "bank-account", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 5, menu: "Mobile Money", identifier: "financial", url: "mobile-money", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 6, menu: "Magasins principaux", identifier: "store", url: "store-principal", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"] },
  { key: 7, menu: "Magasins sécondaires", identifier: "store", url: "store", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"] },
  { key: 8, menu: "Fournisseurs", identifier: "store", url: "supplier", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"] },
  { key: 9, menu: "Produits & Services", identifier: "store", url: "product-service", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"] },
  { key: 10, menu: "Stock", identifier: "store", url: "product-stock", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"] },
  { key: 11, menu: "Bons de commande", identifier: "stock", url: "purchase-order", role: ["ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"] },
  { key: 12, menu: "Appro & Transferts", identifier: "stock", url: "mvt-stock", role: ["ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"] },
  { key: 13, menu: "Personnels", identifier: "personal", url: "personal", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"] },
  { key: 14, menu: "Utilisateurs", identifier: "personal", url: "user", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"] },
  { key: 15, menu: "Dépenses", identifier: "budget", url: "spent", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 16, menu: "Budgets", identifier: "budget", url: "budget", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 17, menu: "Emprunts & prêts", identifier: "engagement", url: "engagement", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 18, menu: "Factures clients", identifier: "engagement", url: "invoice-customer", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 19, menu: "Factures fournisseurs", identifier: "engagement", url: "invoice-supplier", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 20, menu: "Avances versées", identifier: "engagement", url: "advance-paid", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 21, menu: "Ventes", identifier: "sale", url: "sale", role: ["ROLE_CAISSIER"] },
  { key: 22, menu: "Clients", identifier: "sale", url: "customer", role: ["ROLE_CAISSIER"] },
  { key: 23, menu: "Factures", identifier: "sale", url: "invoice", role: ["ROLE_CAISSIER"] },
  { key: 24, menu: "Opération de caisse", identifier: "cash", url: "mvt-cash", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 25, menu: "Opération de banque", identifier: "bank", url: "mvt-bank", role: ["ROLE_CHEF_CAISSIER"] },
  { key: 26, menu: "Manquants", identifier: "cash", url: "missing", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 27, menu: "Excédents", identifier: "cash", url: "surplus", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 28, menu: "Imprimantes", identifier: "setting", url: "print", role: ["ROLE_ADMIN"] },
  { key: 29, menu: "Journalier", identifier: "reporting", url: "day", role: ["ROLE_ADMIN"] },
  { key: 30, menu: "Hebdomadaire", identifier: "reporting", url: "week", role: ["ROLE_ADMIN"] },
  { key: 31, menu: "Rapport activité", identifier: "data", url: "reporting", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"] },
  { key: 32, menu: "Mensuel", identifier: "reporting", url: "month", role: ["ROLE_ADMIN"] },
  { key: 33, menu: "Modifier le mot de passe", identifier: "password", url: "password", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"] },
  { key: 34, menu: "Données", identifier: "data", url: "data", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"] },
  { key: 35, menu: "Intégration", identifier: "data", url: "integration", role: ["ROLE_ADMIN"] },
]








