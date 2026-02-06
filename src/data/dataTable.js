export const enterprises = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Pays", field: "country" },
        { key: 2, header: "Nom", field: "name" },
        { key: 3, header: "Email", field: "email" },
        { key: 4, header: "Tél.", field: "phone" },
        { key: 5, header: "Tél.2", field: "phone2" },
        { key: 6, header: "Slogan", field: "slogan" },
        { key: 7, header: "Régistre de commerce", field: "commercialRegister" },
        { key: 8, header: "B.P.", field: "box" },
        { key: 9, header: "Agréément", field: "authorizationNumber" },
        { key: 10, header: "N.U.I.", field: "uniqueIdentificationNumber" },
        { key: 11, header: "Fournisseurs", field: "suppliers" },
        { key: 12, header: "Créée le", field: "dateCreated" },
        { key: 13, header: "Par", field: "userCreated" },
        { key: 14, header: "Mise à jour le", field: "dateUpdated" },
        { key: 15, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Pays",
        "Nom",
        "Email",
        "Tél.",
        "Tél.2",
        "Slogan",
        "Régistre de commerce",
        "B.P.",
        "Agréément",
        "N.U.I.",
        "Fournisseurs",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const agencies = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Nom", field: "name" },
        { key: 3, header: "Tél.", field: "phone" },
        { key: 4, header: "Email", field: "email" },
        { key: 5, header: "Adresse", field: "address" },
        { key: 6, header: "Comptes bancaires", field: "bankAccounts" },
        { key: 7, header: "Comptes mobile money", field: "mobileMoney" },
        { key: 8, header: "Magasins", field: "stores" },
        { key: 9, header: "Coffre-fort", field: "Safe" },
        { key: 10, header: "Magasins principaux", field: "storePrincipals" },
        { key: 11, header: "Créée le", field: "dateCreated" },
        { key: 12, header: "Par", field: "userCreated" },
        { key: 13, header: "Mise à jour le", field: "dateUpdated" },
        { key: 14, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Nom",
        "Tél.",
        "Email",
        "Adresse",
        "Comptes bancaires",
        "Comptes mobile money",
        "Magasins",
        "Coffre-fort",
        "Magasins principaux", ,
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const safes = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Agence", field: "agency" },
        { key: 3, header: "Nom", field: "name" },
        { key: 4, header: "Solde", field: "balance" },
        { key: 5, header: "Créée le", field: "dateCreated" },
        { key: 6, header: "Par", field: "userCreated" },
        { key: 7, header: "Mise à jour le", field: "dateUpdated" },
        { key: 8, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Nom",
        "Solde",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const cashes = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Agence", field: "agency" },
        { key: 3, header: "Nom", field: "name" },
        { key: 4, header: "Type", field: "type" },
        { key: 5, header: "Personnel", field: "personal" },
        { key: 6, header: "Coffre-fort", field: "safe" },
        { key: 7, header: "Solde", field: "balance" },
        { key: 8, header: "Créée le", field: "dateCreated" },
        { key: 9, header: "Par", field: "userCreated" },
        { key: 10, header: "Mise à jour le", field: "dateUpdated" },
        { key: 11, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Nom",
        "Type",
        "Personnel",
        "Coffre-fort",
        "Solde",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const bankAccounts = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Banque", field: "bank" },
        { key: 3, header: "R.I.B.", field: "rib" },
        { key: 4, header: "Solde", field: "balance" },
        { key: 5, header: "Emprunt", field: "borrowMoney" },
        { key: 6, header: "Prêt", field: "loanMoney" },
        { key: 7, header: "Agences", field: "agencies" },
        { key: 8, header: "Créée le", field: "dateCreated" },
        { key: 9, header: "Par", field: "userCreated" },
        { key: 10, header: "Mise à jour le", field: "dateUpdated" },
        { key: 11, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Banque",
        "R.I.B.",
        "Solde",
        "Emprunt",
        "Prêt",
        "Agences",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const banks = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Nom", field: "name" },
        { key: 2, header: "Créée le", field: "dateCreated" },
        { key: 3, header: "Par", field: "userCreated" },
        { key: 4, header: "Mise à jour le", field: "dateUpdated" },
        { key: 5, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Nom",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const mobileMonies = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Pays", field: "country" },
        { key: 3, header: "Opérateur", field: "operator" },
        { key: 4, header: "Tél.", field: "phone" },
        { key: 5, header: "Solde", field: "balance" },
        { key: 6, header: "Agences", field: "agencies" },
        { key: 7, header: "Créée le", field: "dateCreated" },
        { key: 8, header: "Par", field: "userCreated" },
        { key: 9, header: "Mise à jour le", field: "dateUpdated" },
        { key: 10, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Pays",
        "Opérateur",
        "Tél.",
        "Solde",
        "Agences",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const operators = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Nom", field: "name" },
        { key: 2, header: "Créée le", field: "dateCreated" },
        { key: 3, header: "Par", field: "userCreated" },
        { key: 4, header: "Mise à jour le", field: "dateUpdated" },
        { key: 5, header: "Par", field: "userUpdated" },
    ],

    global: [
        "Nom",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const storePrincipals = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Nom", field: "name" },
        { key: 3, header: "Agences", field: "agencies" },
        { key: 4, header: "Créée le", field: "dateCreated" },
        { key: 5, header: "Par", field: "userCreated" },
        { key: 6, header: "Mise à jour le", field: "dateUpdated" },
        { key: 7, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Nom",
        "Agences",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const personals = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Agence", field: "agency" },
        { key: 3, header: "Nom", field: "lastName" },
        { key: 4, header: "Prénom", field: "firstName" },
        { key: 5, header: "Email", field: "email" },
        { key: 6, header: "Tél.", field: "phone" },
        { key: 7, header: "Tél2.", field: "phone2" },
        { key: 8, header: "Ville", field: "city" },
        { key: 9, header: "Adresse", field: "address" },
        { key: 10, header: "B.P.", field: "box" },
        { key: 11, header: "Genre", field: "gender" },
        { key: 12, header: "Date de naissance", field: "dateBirth" },
        { key: 13, header: "Lieu de naissance", field: "placeBirth" },
        { key: 14, header: "Remunération", field: "remuneration" },
        { key: 15, header: "Magasins", field: "stores" },
        { key: 16, header: "Fonction", field: "title" },
        { key: 17, header: "Créée le", field: "dateCreated" },
        { key: 18, header: "Par", field: "userCreated" },
        { key: 19, header: "Mise à jour le", field: "dateUpdated" },
        { key: 20, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Nom",
        "Prénom",
        "Email",
        "Tél.",
        "Tél2.",
        "Ville",
        "Adresse",
        "B.P.",
        "Genre",
        "Date de naissance",
        "Lieu de naissance",
        "Remunération",
        "Magasins",
        "Fonction",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const titles = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Nom", field: "name" },
        { key: 2, header: "Créée le", field: "dateCreated" },
        { key: 3, header: "Par", field: "userCreated" },
        { key: 4, header: "Mise à jour le", field: "dateUpdated" },
        { key: 5, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Nom",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const users = {

    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Personnel", field: "personal" },
        { key: 2, header: "Login", field: "username" },
        { key: 3, header: "Nom", field: "lastName" },
        { key: 4, header: "Prénom", field: "firstName" },
        { key: 5, header: "Email", field: "email" },
        { key: 6, header: "Tél.", field: "phone" },
        { key: 8, header: "Actif", field: "enabled" },
        { key: 9, header: "Connecté", field: "connected" },
        { key: 10, header: "Rôle", field: "authorities" },
        { key: 11, header: "Nombre connexion", field: "connexion" },
        { key: 12, header: "Créée le", field: "dateCreated" },
        { key: 13, header: "Par", field: "userCreated" },
        { key: 14, header: "Mise à jour le", field: "dateUpdated" },
        { key: 15, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Nom",
        "Prénom",
        "Email",
        "Tél.",
        "Tél2.",
        "Ville",
        "Adresse",
        "B.P.",
        "Genre",
        "Date de naissance",
        "Lieu de naissance",
        "Remunération",
        "Magasins",
        "Fonction",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const categoryServices = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Nom", field: "name" },
        { key: 2, header: "Créée le", field: "dateCreated" },
        { key: 3, header: "Par", field: "userCreated" },
        { key: 4, header: "Mise à jour le", field: "dateUpdated" },
        { key: 5, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Nom",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const services = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Nom", field: "name" },
        { key: 3, header: "Description", field: "description" },
        { key: 4, header: "Prix", field: "price" },
        { key: 5, header: "Catégorie", field: "categoryService" },
        { key: 6, header: "Créée le", field: "dateCreated" },
        { key: 7, header: "Par", field: "userCreated" },
        { key: 8, header: "Mise à jour le", field: "dateUpdated" },
        { key: 9, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Nom",
        "Description",
        "Prix",
        "Catégorie",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const products = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Réf.", field: "ref" },
        { key: 3, header: "Catégorie", field: "catégorie" },
        { key: 4, header: "Nom", field: "name" },
        { key: 5, header: "Prix d'achat", field: "price" },
        { key: 6, header: "Prix de vente", field: "sellingPrice" },
        { key: 7, header: "Cout unitaire", field: "unitCost" },
        { key: 8, header: "Quantité", field: "stock" },
        { key: 9, header: "Valeur", field: "value" },
        { key: 10, header: "Stock de sécurité", field: "securityStock" },
        { key: 11, header: "Créée le", field: "dateCreated" },
        { key: 12, header: "Par", field: "userCreated" },
        { key: 13, header: "Mise à jour le", field: "dateUpdated" },
        { key: 14, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Réf.",
        "Catégorie",
        "Nom",
        "Prix d'achat",
        "Prix de vente",
        "Cout unitaire",
        "Quantité",
        "Valeur",
        "Stock de sécurité",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const stores = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Agence", field: "agency" },
        { key: 3, header: "Nom", field: "name" },
        { key: 4, header: "Type", field: "type" },
        { key: 5, header: "Magasin principal", field: "storePrincipal" },
        { key: 6, header: "Personels", field: "personals" },
        { key: 7, header: "Créée le", field: "dateCreated" },
        { key: 8, header: "Par", field: "userCreated" },
        { key: 9, header: "Mise à jour le", field: "dateUpdated" },
        { key: 10, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Nom",
        "Type",
        "Magasin principal",
        "Personels",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const spents = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Nom", field: "name" },
        { key: 2, header: "Famille", field: "spentFamily" },
        { key: 3, header: "Créée le", field: "dateCreated" },
        { key: 4, header: "Par", field: "userCreated" },
        { key: 5, header: "Mise à jour le", field: "dateUpdated" },
        { key: 6, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Nom",
        "Famille",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}



export const families = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Nom", field: "name" },
        { key: 2, header: "Créée le", field: "dateCreated" },
        { key: 3, header: "Par", field: "userCreated" },
        { key: 4, header: "Mise à jour le", field: "dateUpdated" },
        { key: 5, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Nom",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const budgets = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Agence", field: "agency" },
        { key: 3, header: "Dépense", field: "spent" },
        { key: 4, header: "Date de début", field: "startDate" },
        { key: 5, header: "Date de fin", field: "endDate" },
        { key: 6, header: "Montant", field: "budget" },
        { key: 7, header: "Réalisation", field: "realization" },
        { key: 8, header: "Solde", field: "balance" },
        { key: 9, header: "Statut", field: "statusBudget" },
        { key: 10, header: "Créée le", field: "dateCreated" },
        { key: 11, header: "Par", field: "userCreated" },
        { key: 12, header: "Mise à jour le", field: "dateUpdated" },
        { key: 13, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Dépense",
        "Date de début",
        "Date de fin",
        "Montant",
        "Réalisation",
        "Solde",
        "Statut",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const purchasOrders = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Agence", field: "agency" },
        { key: 3, header: "Prix HT", field: "price" },
        { key: 4, header: "Remise", field: "discount" },
        { key: 5, header: "Prix TTC", field: "priceTTC" },
        { key: 6, header: "Avance", field: "advance" },
        { key: 7, header: "Solde", field: "balance" },
        { key: 8, header: "Paiement", field: "paymentMethod" },
        { key: 9, header: "Fournisseur", field: "supplier" },
        { key: 10, header: "Statut", field: "statusPurchase" },
        { key: 11, header: "Créée le", field: "dateCreated" },
        { key: 12, header: "Par", field: "userCreated" },
        { key: 13, header: "Mise à jour le", field: "dateUpdated" },
        { key: 14, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Prix HT",
        "Remise",
        "Prix TTC",
        "Avance",
        "Paiement",
        "Solde",
        "Fournisseur",
        "Statut",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}

export const suppliers = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Nom", field: "name" },
        { key: 2, header: "Tél.", field: "phone" },
        { key: 3, header: "Email", field: "email" },
        { key: 4, header: "Adresse", field: "address" },
        { key: 5, header: "Point focal", field: "focalPoint" },
        { key: 6, header: "Solde", field: "balance" },
        { key: 7, header: "Factures", field: "invoice" },
        { key: 8, header: "Créée le", field: "dateCreated" },
        { key: 9, header: "Par", field: "userCreated" },
        { key: 10, header: "Mise à jour le", field: "dateUpdated" },
        { key: 11, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Nom",
        "Tél.",
        "Email",
        "Adresse",
        "Point focal",
        "Solde",
        "Factures",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}


export const mvtStocks = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Agence", field: "agency" },
        { key: 3, header: "Date", field: "dateTransaction" },
        { key: 4, header: "Réf.", field: "ref" },
        { key: 5, header: "Magasin principal", field: "storePrincipal" },
        { key: 6, header: "Magasin 1", field: "store01" },
        { key: 7, header: "Magasin 2", field: "store02" },
        { key: 8, header: "Catégorie", field: "category" },
        { key: 9, header: "Produit", field: "product" },
        { key: 10, header: "S.I.", field: "initial" },
        { key: 11, header: "Entrée", field: "incoming" },
        { key: 12, header: "Sortie", field: "outgoing" },
        { key: 13, header: "Stock", field: "stock" },
        { key: 14, header: "Valeur", field: "value" },
        { key: 15, header: "Créée le", field: "dateCreated" },
        { key: 16, header: "Par", field: "userCreated" },
        { key: 17, header: "Mise à jour le", field: "dateUpdated" },
        { key: 18, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Date",
        "Réf.",
        "Magasin principal",
        "Magasin 1",
        "Magasin 2",
        "Catégorie",
        "Produit",
        "S.I.",
        "Entrée",
        "Sortie",
        "Stock",
        "Valeur",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}




export const productStocks = {
    header: [
        { key: 0, header: "Id", field: "id" },
        { key: 1, header: "Entreprise", field: "enterprise" },
        { key: 2, header: "Agence", field: "agency" },
        { key: 3, header: "Magasin principal", field: "storePrincipal" },
        { key: 4, header: "Magasin", field: "store" },
        { key: 5, header: "Produit", field: "product" },
        { key: 6, header: "Lot", field: "lot" },
        { key: 7, header: "Stock", field: "stock" },
        { key: 8, header: "Date d'expiration", field: "dateExpiration" },
        { key: 9, header: "Etat", field: "state" },
        { key: 10, header: "Créée le", field: "dateCreated" },
        { key: 11, header: "Par", field: "userCreated" },
        { key: 12, header: "Mise à jour le", field: "dateUpdated" },
        { key: 13, header: "Par", field: "userUpdated" },
    ],



    global: [
        "Id",
        "Entreprise",
        "Agence",
        "Magasin principal",
        "Magasin",
        "Produit",
        "Lot",
        "Stock",
        "Date d'expiration",
        "Etat",
        "Créée le",
        "Par",
        "Mise à jour le",
        "Par"
    ]

}





