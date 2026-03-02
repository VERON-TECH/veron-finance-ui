import { faFileExport, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../layout/Modal"
import { useRef, useState } from "react";
import Submit from "../../layout/Submit"
import Table from "../../layout/Table";
import { agencies, archives, bankAccounts, banks, budgets, cashes, categoryServices, customers, engagements, enterprises, families, invoices, missings, mobileMonies, mvtBanks, mvtCashes, mvtSalePayments, mvtSales, mvtStocks, operators, payments, personals, products, productStocks, profits, purchasOrders, safes, salePayments, sales, services, spents, storePrincipals, stores, supplierAdvances, suppliers, surplus, titles } from "../../data/dataTable";
import { getAgencyById, getAllAgencies, getAllArchiveBalance, getAllBankAccount, getAllBanks, getAllBudgets, getAllCashes, getAllCustomers, getAllEngagements, getAllEnterprises, getAllInvoices_, getAllMissing, getAllMissing_, getAllMobileMoney, getAllMvtBank, getAllMvtCash, getAllMvtSalePayments, getAllMvtSales, getAllMvtStocks, getAllOperators, getAllPayments, getAllPersonals, getAllProducts, getAllProductStock, getAllProfits, getAllPurchaseOrders, getAllSafes, getAllSalePayments, getAllSales, getAllServices, getAllServices_, getAllSpentFamilies, getAllSpents, getAllStocks, getAllStorePrincipal, getAllStores, getAllSupplierAdvances, getAllSuppliers, getAllSurplus, getAllTitles, getBankAccountById, getBankById, getCashById, getCategoryService, getCategoryServiceById, getCustomerById, getEnterpriseById, getInvoiceById, getLotById, getOperatorById, getPersonalById, getProductById, getSafeById, getSaleById, getServiceById, getSpentById, getStoreById, getStorePrincipalById, getSupplierById, getTitleById } from "../../utils/http";


export default function CardData({ name, date, value }) {
    const user = JSON.parse(localStorage.getItem("user"))
    const dialog = useRef();
    const dialog1 = useRef();
    const inputStartDate = useRef()
    const inputEndDate = useRef()
    const [data, setData] = useState({
        date,
        state: false,
        isLoading: false,
        agency: [],
        archive: [],
        bank: [],
        bankAccount: [],
        prevision: [],
        cash: [],
        category: [],
        customer: [],
        engagement: [],
        enterprise: [],
        invoice: [],
        missing: [],
        mobile: [],
        mvtCash: [],
        mvtBank: [],
        mvtSalePayment: [],
        mvtSale: [],
        mvtStock: [],
        operator: [],
        packageKit: [],
        payment: [],
        personal: [],
        product: [],
        stock: [],
        profit: [],
        purchaseOrder: [],
        safe: [],
        sale: [],
        salePayment: [],
        service: [],
        spent: [],
        spentFamily: [],
        supplierAdvance: [],
        surplus: [],
        storePrincipal: [],
        store: [],
        supplier: [],
        title: []

    })

    async function handleClick() {
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        const controller = new AbortController()
        const signal = controller.signal
        if (data.date === false) {
            if (name !== "") {
                const allAgencies = await getAllAgencies()
                let allArchiveBalance = []
                let allMissing = []
                let allSurplus = []
                let allMvtCashes = []
                let allMvtBank = []
                let allMvtStocks = []
                let allSales = []

                const allBanks = await getAllBanks()
                const allBankAccounts = await getAllBankAccount({ signal, agency: user.agency })
                const allPrevisions = await getAllBudgets({ signal, enterprise: user.enterprise, agency: user.agency })
                const allCashes = await getAllCashes({ signal, enterprise: user.enterprise, agency: user.agency })
                const allCategories = await getCategoryService()
                const allCustomers = await getAllCustomers({ signal, enterprise: user.enterprise })
                const allEngagements = await getAllEngagements({ signal, enterprise: user.enterprise, agency: user.agency })
                const allEnterprises = await getAllEnterprises()
                const allInvoices = await getAllInvoices_()
                const allMobileMonies = await getAllMobileMoney({ signal, agency: user.agency })
                const allMvtSalePayments = await getAllMvtSalePayments()
                const allMvtSales = await getAllMvtSales()
                const allOperators = await getAllOperators()
                const allProducts = await getAllProducts({ signal, enterprise: user.enterprise })
                const allPayments = await getAllPayments()
                const allPersonals = await getAllPersonals({ signal, enterprise: user.enterprise, agency: user.agency })
                const allStocks = await getAllProductStock(user.enterprise, user.agency)
                const allProfits = await getAllProfits({ signal, enterprise: user.enterprise, agency: user.agency })
                const allPurchaseOrders = await getAllPurchaseOrders({ signal, enterprise: user.enterprise, agency: user.agency })
                const allSafes = await getAllSafes({ signal, enterprise: user.enterprise, agency: user.agency })
                const allSalePayments = await getAllSalePayments()
                const allServices = await getAllServices_()
                const allSpents = await getAllSpents()
                const allSpentFamilies = await getAllSpentFamilies()
                const allSupplierAdvances = await getAllSupplierAdvances({ signal, enterprise: user.enterprise, agency: user.agency })
                const allStorePrincipal = await getAllStorePrincipal({ signal, enterprise: user.enterprise, agency: user.agency })
                const allStores = await getAllStores({ signal, enterprise: user.enterprise, agency: user.agency })
                const allSuppliers = await getAllSuppliers({ signal, enterprise: user.enterprise })
                const allTitles = await getAllTitles()

                if (data.state === true) {
                    allArchiveBalance = await getAllArchiveBalance({ startDate: inputStartDate.current.value, endDate: inputEndDate.current.value })
                    allMissing = await getAllMissing_({ signal, startDate: inputStartDate.current.value, endDate: inputEndDate.current.value })
                    allSurplus = await getAllSurplus({ signal, personal: user.personal })
                    allMvtCashes = await getAllMvtCash({ signal, enterprise: user.enterprise, agency: user.agency, cash: 0, startDate: inputStartDate.current.value, endDate: inputEndDate.current.value })
                    allMvtStocks = await getAllMvtStocks({ signal, enterprise: user.enterprise, agency: user.agency, startDate: inputStartDate.current.value, endDate: inputEndDate.current.value })
                    allSales = await getAllSales({ signal, enterprise: user.enterprise, agency: user.agency, startDate: inputStartDate.current.value, endDate: inputEndDate.current.value, cashes: [], customer: 0 })
                    allMvtBank = await getAllMvtBank({ signal, enterprise: user.enterprise, agency: user.agency, startDate: inputStartDate.current.value, endDate: inputEndDate.current.value })

                }
                let tbEl = {
                    agency: [],
                    bankAccount: [],
                    prevision: [],
                    cash: [],
                    customer: [],
                    engagement: [],
                    invoice: [],
                    missing: [],
                    mobile: [],
                    mvtCash: [],
                    mvtBank: [],
                    mvtSalePayment: [],
                    mvtSale: [],
                    mvtStock: [],
                    packageKit: [],
                    payment: [],
                    personal: [],
                    product: [],
                    stock: [],
                    profit: [],
                    purchase: [],
                    safe: [],
                    sale: [],
                    salePayment: [],
                    service: [],
                    supplierAdvance: [],
                    surplus: [],
                    storePrincipal: [],
                    store: []
                }

                for (let a of allAgencies) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    a.enterprise = enterprise.slug
                    tbEl.agency.push(a)
                }

                for (let a of allBankAccounts) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const bank = await getBankById({ id: a.bank, signal })
                    a.enterprise = enterprise.slug
                    a.bank = bank.slug
                    tbEl.bankAccount.push(a)
                }

                for (let a of allPrevisions) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const spent = await getSpentById({ id: a.spent, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.spent = spent.slug
                    tbEl.prevision.push(a)
                }

                for (let a of allCashes) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const personal = await getPersonalById({ id: a.personal, signal })
                    const safe = await getSafeById({ id: a.safe, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.personal = personal.slug
                    a.safe = safe.slug
                    tbEl.cash.push(a)
                }

                for (let a of allCustomers) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    a.enterprise = enterprise.slug
                    tbEl.customer.push(a)
                }

                for (let a of allEngagements) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    tbEl.engagement.push(a)
                }

                for (let a of allInvoices) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    let tiers;
                    if (a.typeTiers === "CLIENT") {
                        tiers = await getCustomerById({ signal, id: a.tiers })
                        a.tiers = tiers.lastName + " " + tiers.firstName
                    } else if (a.typeTiers === "FOURNISSEUR") {
                        tiers = await getSupplierById({ id: a.tiers, signal })
                        a.tiers = tiers.name
                    }
                    tbEl.invoice.push(a)
                }

                for (let a of allMissing) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const personal = await getPersonalById({ id: a.personal, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.personal = personal.lastName + " " + personal.firstName
                    tbEl.missing.push(a)
                }

                for (let a of allMobileMonies) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const operator = await getOperatorById({ id: a.operator, signal })
                    a.enterprise = enterprise.slug
                    a.operator = operator.slug
                    tbEl.mobile.push(a)
                }

                for (let a of allMvtCashes) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const cash = await getCashById({ id: a.cash, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.cash = cash.slug
                    tbEl.mvtCash.push(a)
                }

                for (let a of allMvtBank) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const bank = await getBankAccountById({ id: a.bankAccount, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.bankAccount = bank.slug
                    tbEl.mvtBank.push(a)
                }


                for (let a of allMvtSalePayments) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const cash = await getCashById({ id: a.cash, signal })
                    const sale = await getSaleById({ signal, id: a.sale })
                    const customer = await getCustomerById({ signal, id: a.customer })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.cash = cash.slug
                    a.sale = sale.slug
                    a.customer = customer.lastName + " " + customer.firstName
                    tbEl.mvtSalePayment.push(a)
                }

                for (let a of allMvtSales) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const cash = await getCashById({ id: a.cash, signal })
                    const sale = await getSaleById({ signal, id: a.sale })
                    const customer = await getCustomerById({ signal, id: a.customer })
                    const service = await getServiceById({ signal, id: a.service })
                    const product = await getProductById({ signal, id: a.product })
                    const store = await getStoreById({ id: a.store, signal })
                    const lot = await getLotById({ signal, id: a.lot })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.cash = cash.slug
                    a.sale = sale.slug
                    a.service = service.slug
                    a.product = product[0] == "Impossible de recupérer les données" ? service.slug : product.slug
                    a.store = store[0] == "Impossible de recupérer les données" ? "client" : store.slug,
                        a.lot = lot[0] == "Impossible de recupérer les données" ? "lot0" : lot.slug,

                        a.customer = customer.lastName + " " + customer.firstName
                    tbEl.mvtSale.push(a)
                }

                for (let a of allMvtStocks) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const storePrincipal = await getStorePrincipalById({ id: a.storePrincipal, signal })
                    const store01 = await getStoreById({ id: a.store01, signal })
                    const store02 = await getStoreById({ id: a.store02, signal })
                    const product = await getProductById({ signal, id: a.product })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.storePrincipal = storePrincipal.slug
                    a.store01 = store01.slug
                    a.store02 = store02.slug
                    a.product = product.slug
                    tbEl.mvtStock.push(a)
                }

                for (let a of allProducts) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    a.enterprise = enterprise.slug
                    if (a.category === "PACQUET") {
                        tbEl.packageKit.push(a)
                    }
                    tbEl.product.push(a)

                }

                for (let a of allPayments) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const customer = await getCustomerById({ signal, id: a.customer })
                    const cash = await getCashById({ id: a.cash, signal })
                    const invoice = await getInvoiceById({ signal, id: a.invoice })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.customer = customer.lastName + " " + customer.firstName
                    a.cash = cash.slug
                    a.invoice = invoice.slug
                    tbEl.payment.push(a)
                }

                for (let a of allPersonals) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const title = await getTitleById({ id: a.title, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.title = title.slug
                    tbEl.personal.push(a)
                }

                for (let a of allStocks) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const storePrincipal = await getStorePrincipalById({ id: a.storePrincipal, signal })
                    const store = await getStoreById({ id: a.store, signal })
                    const product = await getProductById({ signal, id: a.product })
                    const lot = await getLotById({ signal, id: a.lot })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.storePrincipal = storePrincipal.slug
                    a.store = store.slug
                    a.product = product.slug
                    a.lot = lot.slug
                    tbEl.personal.push(a)
                }

                for (let a of allProfits) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const sale = await getSaleById({ signal, id: a.sale })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.sale = sale.slug
                    tbEl.profit.push(a)
                }

                for (let a of allPurchaseOrders) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const supplier = await getSupplierById({ id: a.supplier, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.supplier = supplier.slug
                    tbEl.purchase.push(a)
                }

                for (let a of allSafes) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    tbEl.safe.push(a)
                }

                for (let a of allSalePayments) {
                    const sale = await getSaleById({ signal, id: a.sale })
                    a.sale = sale.slug
                    tbEl.salePayment.push(a)
                }

                for (let a of allServices) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const category = await getCategoryServiceById({ id: a.categoryService, signal })
                    a.enterprise = enterprise.slug
                    a.categoryService = category.slug
                    tbEl.service.push(a)
                }

                for (let a of allSupplierAdvances) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const supplier = await getSupplierById({ id: a.supplier, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.supplier = supplier.slug
                    tbEl.service.push(a)
                }

                for (let a of allSupplierAdvances) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    tbEl.supplierAdvance.push(a)
                }

                for (let a of allSurplus) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const personal = await getPersonalById({ id: a.personal, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.personal = personal.lastName + " " + personal.firstName
                    tbEl.surplus.push(a)
                }

                for (let a of allStorePrincipal) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    a.enterprise = enterprise.slug
                    tbEl.storePrincipal.push(a)
                }

                for (let a of allStores) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const storePrincipal = await getStorePrincipalById({ id: a.storePrincipal, signal })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.storePrincipal = storePrincipal[0] == "Impossible de recupérer les données" ? "Non attribué" : storePrincipal.slug
                    tbEl.store.push(a)
                }

                for (let a of allSales) {
                    const enterprise = await getEnterpriseById({ id: a.enterprise, signal })
                    const agency = await getAgencyById({ id: a.agency, signal })
                    const cash = await getCashById({ id: a.cash, signal })
                    const customer = await getCustomerById({ signal, id: a.customer })
                    const invoice = await getInvoiceById({ signal, id: a.invoice })
                    a.enterprise = enterprise.slug
                    a.agency = agency.slug
                    a.cash = cash.slug
                    a.customer = customer.lastName + " " + customer.firstName
                    a.invoice = invoice.slug
                    tbEl.sale.push(a)
                }





                setData(prev => {
                    return {
                        ...prev,
                        isLoading: false,
                        agency: tbEl.agency,
                        archive: allArchiveBalance,
                        bank: allBanks,
                        bankAccount: tbEl.bankAccount,
                        prevision: tbEl.prevision,
                        cash: tbEl.cash,
                        category: allCategories,
                        customer: tbEl.customer,
                        engagement: tbEl.engagement,
                        enterprise: allEnterprises,
                        invoice: tbEl.invoice,
                        missing: tbEl.missing,
                        mobile: tbEl.mobile,
                        mvtCash: tbEl.mvtCash,
                        mvtBank: tbEl.mvtBank,
                        mvtSalePayment: tbEl.mvtSalePayment,
                        mvtSale: tbEl.mvtSale,
                        mvtStock: tbEl.mvtStock,
                        operator: allOperators,
                        packageKit: tbEl.packageKit,
                        payment: tbEl.payment,
                        personal: tbEl.personal,
                        product: tbEl.product,
                        stock: allStocks,
                        profit: tbEl.profit,
                        purchase: tbEl.purchase,
                        safe: tbEl.safe,
                        sale: tbEl.sale,
                        salePayment: allSalePayments,
                        service: tbEl.service,
                        spent: allSpents,
                        spentFamily: allSpentFamilies,
                        supplierAdvance: tbEl.supplierAdvance,
                        surplus: tbEl.surplus,
                        storePrincipal: tbEl.storePrincipal,
                        store: tbEl.store,
                        supplier: allSuppliers,
                        title: allTitles
                    }
                })
                dialog1.current.open()
            }

        } else {
            dialog.current.open()
            setData(prev => {
                return {
                    ...prev,
                    date: false,
                    state: true,
                    isLoading: false
                }
            })
        }

    }




    return <><div className="bg-sky-50 text-sky-950 border border-1 shadow-md shadow-sky-950 font-medium w-1/5 h-24 p-1 rounded-xl flex flex-col gap-2 items-center">
        <header className="bg-sky-950 text-sky-50 rounded p-1 text-center font-bold w-full shadow-md shadow-sky-950 mb-4">{name}</header>
        <div className="flex justify-center w-full gap-2">
            <button onClick={handleClick} className=" w-2/3 bg-sky-950 text-sky-50 p-1 rounded font-bold cursor-pointer shadow-md shadow-sky-950"><FontAwesomeIcon icon={faFileExport} className="me-2" />Rapport</button>
            {data?.isLoading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
        </div>
    </div>
        <Modal ref={dialog} size="h-2/9 w-3/9" title={name.toUpperCase()}>
            <div>
                {date && <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center gap-4 mb-4">
                    <input type="date" name="startDate" placeholder="Date de fin" className="border rounded px-1 shadow-lg shadow-sky-950" ref={inputStartDate} />
                    <input type="date" name="endDate" placeholder="Date de fin" className="border rounded px-1 shadow-lg shadow-sky-950" ref={inputEndDate} />
                    <div className="flex flex-col gap-2 items-center">
                        <Submit onClick={handleClick}>Imprimer</Submit>
                        {data?.isLoading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                    </div>

                </div>}
            </div>
        </Modal>



        <Modal ref={dialog1} size="h-6/7 w-7/7" title={name.toUpperCase()}>
            <div className="w-full">
                <Table
                    data={value === "agency" ? data.agency :
                        value === "archiveBalance" ? data.archive :
                            value === "bank" ? data.bank :
                                value === "bankAccount" ? data.bankAccount :
                                    value === "budget" ? data.prevision :
                                        value === "cash" ? data.cash :
                                            value === "categoryService" ? data.category :
                                                value === "customer" ? data.customer :
                                                    value === "engagement" ? data.engagement :
                                                        value === "enterprise" ? data.enterprise :
                                                            value === "invoice" ? data.invoice :
                                                                value === "missing" ? data.missing :
                                                                    value === "mobileMoney" ? data.mobile :
                                                                        value === "mvtCash" ? data.mvtCash :
                                                                            value === "mvtSalePayment" ? data.mvtSalePayment :
                                                                                value === "mvtSales" ? data.mvtSale :
                                                                                    value === "mvtStock" ? data.mvtStock :
                                                                                        value === "operatorName" ? data.operator :
                                                                                            value === "packageKit" ? data.packageKit :
                                                                                                value === "payment" ? data.payment :
                                                                                                    value === "personal" ? data.personal :
                                                                                                        value === "product" ? data.product :
                                                                                                            value === "productStock" ? data.stock :
                                                                                                                value === "profit" ? data.profit :
                                                                                                                    value === "purchaseOrder" ? data.purchase :
                                                                                                                        value === "safe" ? data.safe :
                                                                                                                            value === "sale" ? data.sale :
                                                                                                                                value === "salePayment" ? data.salePayment :
                                                                                                                                    value === "serviceSale" ? data.service :
                                                                                                                                        value === "spent" ? data.spent :
                                                                                                                                            value === "spentFamily" ? data.spentFamily :
                                                                                                                                                value === "supplierAdvance" ? data.supplierAdvance :
                                                                                                                                                    value === "surplus" ? data.surplus :
                                                                                                                                                        value === "storePrincipal" ? data.storePrincipal :
                                                                                                                                                            value === "store" ? data.store :
                                                                                                                                                                value === "supplier" ? data.supplier :
                                                                                                                                                                    value === "title" ? data.title :
                                                                                                                                                                        value === "mvtBank" ? data.mvtBank : []}
                    headers={value === "agency" ? agencies.header :
                        value === "archiveBalance" ? archives.header :
                            value === "bank" ? banks.header :
                                value === "bankAccount" ? bankAccounts.header :
                                    value === "budget" ? budgets.header :
                                        value === "cash" ? cashes.header :
                                            value === "categoryService" ? categoryServices.header :
                                                value === "customer" ? customers.header :
                                                    value === "engagement" ? engagements.header :
                                                        value === "enterprise" ? enterprises.header :
                                                            value === "invoice" ? invoices.header :
                                                                value === "missing" ? missings.header :
                                                                    value === "mobileMoney" ? mobileMonies.header :
                                                                        value === "mvtCash" ? mvtCashes.header :
                                                                            value === "mvtSalePayment" ? mvtSalePayments.header :
                                                                                value === "mvtSales" ? mvtSales.header :
                                                                                    value === "mvtStock" ? mvtStocks.header :
                                                                                        value === "operatorName" ? operators.header :
                                                                                            value === "packageKit" ? products.header :
                                                                                                value === "payment" ? payments.header :
                                                                                                    value === "personal" ? personals.header :
                                                                                                        value === "product" ? products.header :
                                                                                                            value === "productStock" ? productStocks.header :
                                                                                                                value === "profit" ? profits.header :
                                                                                                                    value === "purchaseOrder" ? purchasOrders.header :
                                                                                                                        value === "safe" ? safes.header :
                                                                                                                            value === "sale" ? sales.header :
                                                                                                                                value === "salePayment" ? salePayments.header :
                                                                                                                                    value === "serviceSale" ? services.header :
                                                                                                                                        value === "spent" ? spents.header :
                                                                                                                                            value === "spentFamily" ? families.header :
                                                                                                                                                value === "supplierAdvance" ? supplierAdvances.header :
                                                                                                                                                    value === "surplus" ? surplus.header :
                                                                                                                                                        value === "storePrincipal" ? storePrincipals.header :
                                                                                                                                                            value === "store" ? stores.header :
                                                                                                                                                                value === "supplier" ? suppliers.header :
                                                                                                                                                                    value === "title" ? titles.header :
                                                                                                                                                                        value === "mvtBank" ? mvtBanks.header : []
                    }
                    emptyMessage="Aucune donnée trouvée"
                    globalFilterFields={value = "agency" ? agencies.global :
                        value = "archiveBalance" ? archives.global :
                            value = "bank" ? banks.global :
                                value = "bankAccount" ? bankAccounts.global :
                                    value = "budget" ? budgets.global :
                                        value = "cash" ? cashes.global :
                                            value = "categoryService" ? categoryServices.global :
                                                value = "customer" ? customers.global :
                                                    value = "engagement" ? engagements.global :
                                                        value = "enterprise" ? enterprises.global :
                                                            value = "invoice" ? invoices.global :
                                                                value = "missing" ? missings.global :
                                                                    value = "mobileMoney" ? mobileMonies.global :
                                                                        value = "mvtCash" ? mvtCashes.global :
                                                                            value = "mvtSalePayment" ? mvtSalePayments.global :
                                                                                value = "mvtSales" ? mvtSales.global :
                                                                                    value = "mvtStock" ? mvtStocks.global :
                                                                                        value = "operatorName" ? operators.global :
                                                                                            value = "packageKit" ? products.global :
                                                                                                value = "payment" ? payments.global :
                                                                                                    value = "personal" ? personals.global :
                                                                                                        value = "product" ? products.global :
                                                                                                            value = "productStock" ? productStocks.global :
                                                                                                                value = "profit" ? profits.global :
                                                                                                                    value = "purchaseOrder" ? purchasOrders.global :
                                                                                                                        value = "safe" ? safes.global :
                                                                                                                            value = "sale" ? sales.global :
                                                                                                                                value = "salePayment" ? salePayments.global :
                                                                                                                                    value = "serviceSale" ? services.global :
                                                                                                                                        value = "spent" ? spents.global :
                                                                                                                                            value = "spentFamily" ? families.global :
                                                                                                                                                value = "supplierAdvance" ? supplierAdvances.global :
                                                                                                                                                    value = "surplus" ? surplus.global :
                                                                                                                                                        value = "storePrincipal" ? storePrincipals.global :
                                                                                                                                                            value = "supplier" ? suppliers.global :
                                                                                                                                                                value = "title" ? titles.global :
                                                                                                                                                                    value === "mvtBank" ? mvtBanks.global : ""}
                    sheet={name}
                    titleRef=""
                    size="" />
            </div>
        </Modal>
    </>
}