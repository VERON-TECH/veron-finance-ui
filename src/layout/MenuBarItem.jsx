import { useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { modalActions } from "../store/modalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown, faBank, faBuilding, faCalendarDay, faCalendarTimes, faCartPlus, faCashRegister, faCoins, faFileInvoice, faGlobe, faHome, faKey, faMinus, faMoneyBillTransfer, faPerson, faPersonArrowDownToLine, faPhoneAlt, faPrint, faSave, faShop, faShoppingBag, faShoppingCart, faSquarePlus, faStore, faStoreAlt, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getAllBankAccount, getAllCashes, getAllCustomers, getAllEngagements, getAllInvoices, getAllMissing, getAllMobileMoney, getAllMvtCash, getAllPersonals, getAllPrints, getAllProducts, getAllProductStock, getAllPurchaseOrders, getAllSafes, getAllSales, getAllStorePrincipal, getAllStores, getAllSupplierAdvances, getAllSuppliers, getAllSurplus, getAllUsers } from "../utils/http";




export default function MenuBarItem({ url, title, size = "w-4/25" }) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"))
  function handleClick() {
    dispatch(modalActions.update(title));
  }
  const [item, setItem] = useState({
    nb: {
      sales: 0,
      customers: 0,
      invoices: 0,
      invoices_: 0,
      mvtCashes: 0,
      missing: 0,
      surplus: 0,
      personals: 0,
      users: 0,
      storePrincipal: 0,
      store: 0,
      suppliers: 0,
      products: 0,
      productStocks: 0,
      engagements: 0,
      prints: 0,
      purchase: 0

    },
    balance: {
      bank: 0,
      mobileMoney: 0,
      advance: 0,
      safes: 0,
      cashes: 0
    }
  })
  useEffect(() => {
    async function get(signal) {
      let cashes = []
      for (let c of user.cashes) {
        cashes.push(c.value)
      }
      let nb = {
        sales: 0,
        customers: 0,
        invoices: 0,
        invoices_: 0,
        mvtCashes: 0,
        missing: 0,
        surplus: 0,
        personals: 0,
        users: 0,
        storePrincipal: 0,
        store: 0,
        suppliers: 0,
        products: 0,
        productStocks: 0,
        engagements: 0,
        prints: 0,
        purchase: 0

      }

      let balance = {
        bank: 0,
        mobileMoney: 0,
        advance: 0,
        safes: 0,
        cashes: 0
      }


      const allSales = await getAllSales({ signal, enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString(), cashes })
      const allCustomers = await getAllCustomers({ signal, enterprise: user.enterprise })
      const allInvoices = await getAllInvoices({ signal, enterprise: user.enterprise, agency: user.agency, invoiceType: "EMISE" })
      const allMissing = await getAllMissing({ signal, personal: user.personal })
      const allSurplus = await getAllSurplus({ signal, personal: user.personal })
      const allBanks = await getAllBankAccount({ signal, agency: 0 })
      const allMobileMoney = await getAllMobileMoney({ signal, agency: 0 })
      const allPersonals = await getAllPersonals({ signal, enterprise: user.enterprise, agency: user.agency })
      const allUsers = await getAllUsers({ signal, personals: [], enterprise: user.enterprise, agency: user.agency })
      const allStorePrincipals = await getAllStorePrincipal({ signal, enterprise: user.enterprise, agency: user.agency })
      const allStores = await getAllStores({ signal, enterprise: user.enterprise, agency: user.agency })
      const allSuppliers = await getAllSuppliers({ signal, enterprise: user.enterprise })
      const allProducts = await getAllProducts({ signal, enterprise: user.enterprise })
      const allProductStocks = await getAllProductStock()
      const allEngagements = await getAllEngagements({ signal, enterprise: user.enterprise, agency: user.agency })
      const allSupplierAdvances = await getAllSupplierAdvances({ signal, enterprise: user.enterprise, agency: user.agency })
      const allPrints = await getAllPrints({ signal, enterprise: user.enterprise, agency: user.agency })
      const allSafes = await getAllSafes({ signal, enterprise: user.enterprise, agency: user.agency })
      const allCashes = await getAllCashes({ signal, enterprise: user.enterprise, agency: user.agency })
      const allPurchases = await getAllPurchaseOrders({ signal, enterprise: user.enterprise, agency: user.agency })

      let allMvtCashes = []
      for (let cash of user.cashes) {
        allMvtCashes = await getAllMvtCash({ signal, enterprise: user.enterprise, agency: user.agency, cash: cash.key, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() })
      }
      nb.sales = allSales.length
      nb.customers = allCustomers.length
      nb.mvtCashes = allMvtCashes.length
      nb.surplus = allSurplus.length
      nb.personals = allPersonals.length
      nb.users = allUsers.length
      nb.storePrincipal = allStorePrincipals.length
      nb.store = allStores.length
      nb.suppliers = allSuppliers.length
      nb.products = allProducts.length
      nb.productStocks = allProductStocks.length
      nb.prints = allPrints.length

      allInvoices.forEach(i => {
        if (i.statusInvoice === "EN_INSTANCE" && i.invoiceType === "EMISE") {
          nb.invoices += 1
        }
        if (i.statusInvoice === "EN_INSTANCE" && i.invoiceType === "RECUE") {
          nb.invoices_ += 1
        }
      })

      allEngagements.forEach(e => {
        if (e.balance > 0) {
          nb.engagements += 1
        }
      })

      allPurchases.forEach(p => {
        if (p.statusPurchase === "EN_INSTANCE") {
          nb.purchase += 1
        }
      })

      allMissing.forEach(i => {
        if (i.status === "EN_INSTANCE") {
          nb.missing += 1
        }
      })

      allBanks.forEach(b => {
        balance.bank += b.balance
      })

      allMobileMoney.forEach(m => {
        balance.mobileMoney += m.balance
      })

      allSafes.forEach(s => {
        balance.safes += s.balance
      })

      allCashes.forEach(c => {
        balance.cashes += c.balance
      })

      allSupplierAdvances.forEach(a => {
        balance.advance += a.balance
      })

      setItem(prev => {
        return {
          ...prev,
          nb,
          balance

        }
      })
    }
    get()

  }, [])
  const className = `cursor-pointer flex justify-center items-center font-medium ${size} w-60 hover:border-b-4 focus:border-b-4 active:border-b-4 hover:pb-1`
  return <NavLink to={url} className={`({isActive})=>isActive ? ${className} : undefined`} onClick={handleClick}>
    {title === "Entreprise" && < FontAwesomeIcon icon={faBuilding} className="me-4" />}
    {title === "Agences" && < FontAwesomeIcon icon={faHome} className="me-4" />}
    {title.includes("Coffre-forts") && < FontAwesomeIcon icon={faCashRegister} className="me-4" />}
    {title.includes("Caisses") && < FontAwesomeIcon icon={faCoins} className="me-4" />}
    {title.includes("Banques") && < FontAwesomeIcon icon={faBank} className="me-4" />}
    {title === "Mobile Money" && < FontAwesomeIcon icon={faPhoneAlt} className="me-4" />}
    {title.includes("Magasins principaux") && < FontAwesomeIcon icon={faStoreAlt} className="me-4" />}
    {title.includes("Magasins sécondaires") && < FontAwesomeIcon icon={faStore} className="me-2" />}
    {title.includes("Bons de commande") && < FontAwesomeIcon icon={faShoppingCart} className="me-4" />}
    {title.includes("Personnels") && < FontAwesomeIcon icon={faPerson} className="me-4" />}
    {title.includes("Utilisateurs") && < FontAwesomeIcon icon={faUser} className="me-4" />}
    {title.includes("Produits & Services") && < FontAwesomeIcon icon={faGlobe} className="me-4" />}
    {title === "Dépenses" && < FontAwesomeIcon icon={faCartPlus} className="me-4" />}
    {title === "Budgets" && < FontAwesomeIcon icon={faCalendarTimes} className="me-4" />}
    {title.includes("Fournisseurs") && < FontAwesomeIcon icon={faPersonArrowDownToLine} className="me-4" />}
    {title === "Appro & Transferts" && < FontAwesomeIcon icon={faArrowCircleDown} className="me-4" />}
    {title.includes("Stock") && < FontAwesomeIcon icon={faSave} className="me-4" />}
    {title.includes("Emprunts & prêts") && < FontAwesomeIcon icon={faCoins} className="me-4" />}
    {title.includes("Ventes") && < FontAwesomeIcon icon={faShoppingBag} className="me-4" />}
    {title.includes("Clients") && < FontAwesomeIcon icon={faUserGroup} className="me-4" />}
    {title.includes("Factures") && !title.includes("clients") && !title.includes("fournisseurs") ? < FontAwesomeIcon icon={faFileInvoice} className="me-4" /> : undefined}
    {title.includes("Factures clients") && < FontAwesomeIcon icon={faFileInvoice} className="me-4" />}
    {title.includes("Factures fournisseurs") && < FontAwesomeIcon icon={faFileInvoice} className="me-4" />}
    {title.includes("Avances versées") && < FontAwesomeIcon icon={faMoneyBillTransfer} className="me-4" />}
    {title.includes("Manquants") && < FontAwesomeIcon icon={faMinus} className="me-4" />}
    {title.includes("Excédents") && < FontAwesomeIcon icon={faSquarePlus} className="me-4" />}
    {title.includes("Imprimantes") && < FontAwesomeIcon icon={faPrint} className="me-4" />}
    {title === "Journalier" || title === "Hebdomadaire" || title === "Mensuel" ? < FontAwesomeIcon icon={faCalendarDay} className="me-4" /> : undefined}
    {title === "Modifier le mot de passe" && < FontAwesomeIcon icon={faKey} className="me-4" />}
    {title.includes("Ventes") ? <><span className="me-4">Ventes</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.sales).toLocaleString()}</span></> :
      title.includes("Clients") ? <><span className="me-4">Clients</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.customers).toLocaleString()}</span></> :
        title.includes("Factures") && title.includes("Factures") && !title.includes("clients") && !title.includes("fournisseurs") ? <><span className="me-4">Factures</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.invoices).toLocaleString()}</span></> :
          title.includes("Opération de caisse") ? <><span className="me-4">Opération de caisse</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.mvtCashes).toLocaleString()}</span></> :
            title.includes("Manquants") ? <><span className="me-4">Manquants</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.missing).toLocaleString()}</span></> :
              title.includes("Excédents") ? <><span className="me-4">Excédents</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.surplus).toLocaleString()}</span></> :
                title.includes("Banques") ? <><span className="me-4">Banques</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.balance.bank).toLocaleString()}</span></> :
                  title.includes("Mobile Money") ? <><span className="me-4">Mobile Money</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.balance.mobileMoney).toLocaleString()}</span></> :
                    title.includes("Personnels") ? <><span className="me-4">Personnels</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.personals).toLocaleString()}</span></> :
                      title.includes("Utilisateurs") ? <><span className="me-4">Utilisateurs</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.users).toLocaleString()}</span></> :
                        title.includes("Magasins principaux") ? <><span className="me-2">Magasins principaux</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.storePrincipal).toLocaleString()}</span></> :
                          title.includes("Magasins sécondaires") ? <><span className="me-1">Magasins sécondaires</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.store).toLocaleString()}</span></> :
                            title.includes("Fournisseurs") ? <><span className="me-4">Fournisseurs</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.suppliers).toLocaleString()}</span></> :
                              title.includes("Produits & Services") ? <><span className="me-4">Produits & Services</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.products).toLocaleString()}</span></> :
                                title.includes("Stock") ? <><span className="me-4">Stock</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.productStocks).toLocaleString()}</span></> :
                                  title.includes("Factures clients") ? <><span className="me-4">Factures clients</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.invoices).toLocaleString()}</span></> :
                                    title.includes("Factures fournisseurs") ? <><span className="me-4">Factures fournisseurs</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.invoices_).toLocaleString()}</span></> :
                                      title.includes("Emprunts & prêts") ? <><span className="me-4">Emprunts & prêts</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.engagements).toLocaleString()}</span></> :
                                        title.includes("Avances versées") ? <><span className="me-4">Avances versées</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.balance.advance).toLocaleString()}</span></> :
                                          title.includes("Imprimantes") ? <><span className="me-4">Imprimante</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.prints).toLocaleString()}</span></> :
                                            title.includes("Coffre-forts") ? <><span className="me-4">Coffre-forts</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.balance.safes).toLocaleString()}</span></> :
                                              title.includes("Caisses") ? <><span className="me-4">Caisses</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.balance.cashes).toLocaleString()}</span></> :
                                                title.includes("Bons de commande") ? <><span className="me-4">Bons de commande</span><span className="border px-1 rounded bg-red-700 text-sky-50">{Number(item.nb.purchase).toLocaleString()}</span></> :
                                                  title}
  </NavLink >
}