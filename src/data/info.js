export const countries = [
  { key: 0, name: "CAMEROUN", value: "CAMEROUN" },
]

export const genders = [
  { key: 0, name: "MASCULIN", value: "MASCULIN" },
  { key: 1, name: "FEMININ", value: "FEMININ" },
]

export const cities = [
  { key: 0, name: "YAOUNDE", value: "YAOUNDE" },
  { key: 1, name: "DOUALA", value: "DOUALA" },
  { key: 2, name: "BAFOUSSAM", value: "BAFOUSSAM" },
  { key: 3, name: "EBOLOWA", value: "EBOLOWA" },
  { key: 4, name: "CAMPO", value: "CAMPO" },
]

export const roles = [
  { key: 0, name: "ADMIN", value: "ROLE_ADMIN" },
  { key: 1, name: "COMPTABLE", value: "ROLE_COMPTABLE" },
  { key: 2, name: "GESTIONNAIRE_DE_STOCK", value: "ROLE_GESTIONNAIRE_DE_STOCK" },
  { key: 3, name: "RESPONSABLE_RH", value: "ROLE_RESPONSABLE_RH" },
  { key: 4, name: "CHEF_CAISSIER", value: "ROLE_CHEF_CAISSIER" },
  { key: 5, name: "CAISSIER", value: "ROLE_CAISSIER" },
]

export const typeTransfer = [
  { key: 0, name: "ENTREPRISE-->ENTREPRISE", value: "ENTREPRISE-->ENTREPRISE" },
  { key: 1, name: "AGENCE-->AGENCE", value: "AGENCE-->AGENCE" },
]


export const categoryProduct = [
  { key: 0, name: "PRODUITS", value: "PRODUITS" },
  { key: 1, name: "FOURNITURES", value: "FOURNITURES" },
]

export const paymentMethodPurchase = [
  { key: 0, name: "A_CREDIT", value: "A_CREDIT" },
  { key: 1, name: "AVANCE_VERSEE", value: "AVANCE_VERSEE" },
]


export const paymentMethod = [
  { key: 0, name: "ESPECES", value: "ESPECES" },
  { key: 1, name: "VIREMENT", value: "VIREMENT" },
  { key: 2, name: "MOBILE_MONEY", value: "MOBILE_MONEY" },
  { key: 3, name: "A_CREDIT", value: "A_CREDIT" },
  { key: 4, name: "AVANCE_CLIENT", value: "AVANCE_CLIENT" },
]

export const paymentMethodPayement = [
  { key: 0, name: "ESPECES", value: "ESPECES" },
  { key: 1, name: "VIREMENT", value: "VIREMENT" },
  { key: 2, name: "MOBILE_MONEY", value: "MOBILE_MONEY" },
]


export const paymentMethodPayment = [
  { key: 0, name: "ESPECES", value: "ESPECES" },
  { key: 1, name: "VIREMENT", value: "VIREMENT" },
  { key: 2, name: "MOBILE_MONEY", value: "MOBILE_MONEY" },
]


export const typeCash = [
  { key: 0, name: "APPRO_CAISSE_EN_ENTREE", value: "APPRO_CAISSE_EN_ENTREE", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 1, name: "APPRO_CAISSE_EN_SORTIE", value: "APPRO_CAISSE_EN_SORTIE", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 2, name: "APPRO_CAISSE_VIA_LA_BANQUE", value: "APPRO_CAISSE_VIA_LA_BANQUE", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 3, name: "RETRAIT_POUR_VERSEMENT_BANQUE", value: "RETRAIT_POUR_VERSEMENT_BANQUE", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 4, name: "APPRO_CAISSE_VIA_COMPTE_MOBILE_MONEY", value: "APPRO_CAISSE_VIA_COMPTE_MOBILE_MONEY", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 5, name: "RETRAIT_POUR_APPRO_COMPTE_MOBILE_MONEY", value: "RETRAIT_POUR_APPRO_COMPTE_MOBILE_MONEY", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 6, name: "REGLEMENT_BON_DE_COMMANDE", value: "REGLEMENT_BON_DE_COMMANDE", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 7, name: "CONSTAT_EXCEDENT", value: "CONSTAT_EXCEDENT", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 8, name: "CONSTAT_MANQUANT", value: "CONSTAT_MANQUANT", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 9, name: "ANNULATION_CONSTAT_EXCEDENT", value: "ANNULATION_CONSTAT_EXCEDENT", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 10, name: "DEPENSES", value: "DEPENSES", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 11, name: "EMPRUNT_RECU", value: "EMPRUNT_RECU", role: ["ROLE_CAISSIER"] },
  { key: 12, name: "AUTRES_VERSEMENTS", value: "AUTRES_VERSEMENTS", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 13, name: "AUTRES_RETRAITS", value: "AUTRES_RETRAITS", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 15, name: "VERSEMENT_MANQUANTS", value: "VERSEMENT_MANQUANTS", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 16, name: "AVANCE_CLIENT", value: "AVANCE_CLIENT", role: ["ROLE_CAISSIER"] },
  { key: 17, name: "AVANCE_VERSEE", value: "AVANCE_VERSEE", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 18, name: "REMBOURSEMENT_CLIENT", value: "REMBOURSEMENT_CLIENT", role: ["ROLE_CAISSIER"] },
  { key: 19, name: "REMBOURSEMENT_EMPRUNT", value: "REMBOURSEMENT_EMPRUNT", role: ["ROLE_CAISSIER"] },
  { key: 20, name: "REMBOURSEMENT_PRET", value: "REMBOURSEMENT_PRET", role: ["ROLE_CAISSIER"] },
  { key: 21, name: "PRET_ACCORDE", value: "PRET_ACCORDE", role: ["ROLE_CAISSIER"] },
  { key: 22, name: "APPRO_COFFRE_FORT_VIA_CAISSE", value: "APPRO_COFFRE_FORT_VIA_CAISSE", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
  { key: 23, name: "APPRO_CAISSE_VIA_COFFRE_FORT", value: "APPRO_CAISSE_VIA_COFFRE_FORT", role: ["ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"] },
]

export const sens = [
  { key: 0, name: "ENCAISSEMENT", value: "ENCAISSEMENT" },
  { key: 1, name: "DECAISSEMENT", value: "DECAISSEMENT" },
]


export const prints = [
  { key: 0, name: "IMPRIMANTE_LASER", value: "IMPRIMANTE_LASER" },
  { key: 1, name: "IMPRIMANTE_PAPIER_THERMIQUE", value: "IMPRIMANTE_PAPIER_THERMIQUE" },
  { key: 2, name: "IMPRIMANTE_MATRICIELLE", value: "IMPRIMANTE_MATRICIELLE" },
]


export const dataEntities = [
  { key: 0, name: "Agences", value: "agency", role: ["ROLE_ADMIN"], date: false },
  { key: 1, name: "Soldes archivés", value: "archiveBalance", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: true },
  { key: 2, name: "Banques", value: "bank", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 3, name: "Comptes bancaires", value: "bankAccount", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 4, name: "Prévisions", value: "budget", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 5, name: "Caisses", value: "cash", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 6, name: "Catégorie de service", value: "categoryService", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 7, name: "Client", value: "customer", role: ["ROLE_ADMIN", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: false },
  { key: 8, name: "Engagement", value: "engagement", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 10, name: "Entreprise", value: "enterprise", role: ["ROLE_ADMIN"], date: false },
  { key: 11, name: "Factures", value: "invoice", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"], date: false },
  { key: 12, name: "Lot", value: "lot", role: [], date: false },
  { key: 13, name: "Manquants", value: "missing", role: ["ROLE_ADMIN", "ROLE_CAISSIER", "ROLE_CHEF_CAISSIER"], date: true },
  { key: 14, name: "Mobile Money", value: "mobileMoney", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 15, name: "Operation de caisse", value: "mvtCash", role: ["ROLE_ADMIN", "ROLE_CAISSIER", "ROLE_CHEF_CAISSIER", "ROLE_COMPTABLE"], date: true },
  { key: 16, name: "Operation de banque", value: "mvtBank", role: ["ROLE_ADMIN", "ROLE_CHEF_CAISSIER", "ROLE_COMPTABLE"], date: true },
  { key: 17, name: "Remboursement dettes", value: "mvtSalePayment", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: false },
  { key: 18, name: "Ventes détaillées", value: "mvtSales", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: false },
  { key: 19, name: "Transfert des articles", value: "mvtStock", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_GESTIONNAIRE_DE_STOCK"], date: true },
  { key: 20, name: "Opérateurs", value: "operatorName", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 21, name: "Paquets de produit", value: "packageKit", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 22, name: "Réglements", value: "payment", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: false },
  { key: 23, name: "Personnels", value: "personal", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"], date: false },
  { key: 25, name: "Produits", value: "product", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 26, name: "Stocks", value: "productStock", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 27, name: "Profits", value: "profit", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: false },
  { key: 28, name: "Bon de commande", value: "purchaseOrder", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 29, name: "Coffre-forts", value: "safe", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: false },
  { key: 30, name: "Ventes", value: "sale", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: true },
  { key: 31, name: "Dettes ventes", value: "salePayment", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: false },
  { key: 32, name: "Services", value: "serviceSale", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 33, name: "Dépenses", value: "spent", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 34, name: "Famille dépense", value: "spentFamily", role: ["ROLE_ADMIN", "ROLE_COMPTABLE"], date: false },
  { key: 35, name: "Avances versées", value: "supplierAdvance", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 36, name: "Excédents", value: "surplus", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_CHEF_CAISSIER", "ROLE_CAISSIER"], date: false },
  { key: 37, name: "Magasins principaux", value: "storePrincipal", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 38, name: "Magasins sécondaires", value: "store", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 39, name: "Fournisseurs", value: "supplier", role: ["ROLE_ADMIN", "ROLE_COMPTABLE", "ROLE_GESTIONNAIRE_DE_STOCK"], date: false },
  { key: 40, name: "Fonction", value: "title", role: ["ROLE_ADMIN", "ROLE_RESPONSABLE_RH"], date: false },
]


export const typeBank = [
  { key: 0, name: "APPRO_CAISSE_VIA_LA_BANQUE", value: "APPRO_CAISSE_VIA_LA_BANQUE" },
  { key: 1, name: "REGLEMENT_BON_DE_COMMANDE", value: "REGLEMENT_BON_DE_COMMANDE" },
  { key: 2, name: "EMPRUNT_RECU", value: "EMPRUNT_RECU" },
  { key: 3, name: "AUTRES_VERSEMENTS", value: "AUTRES_VERSEMENTS" },
  { key: 4, name: "AUTRES_RETRAITS", value: "AUTRES_RETRAITS" },
  { key: 5, name: "AVANCE_CLIENT", value: "AVANCE_CLIENT" },
  { key: 6, name: "AVANCE_VERSEE", value: "AVANCE_VERSEE" },
  { key: 7, name: "REMBOURSEMENT_EMPRUNT", value: "REMBOURSEMENT_EMPRUNT" },
  { key: 8, name: "REMBOURSEMENT_PRET", value: "REMBOURSEMENT_PRET" },
  { key: 9, name: "PRET_ACCORDE", value: "PRET_ACCORDE" },

]

export const sensBank = [
  { key: 0, name: "DEBIT", value: "DEBIT" },
  { key: 1, name: "CREDIT", value: "CREDIT" }
]







