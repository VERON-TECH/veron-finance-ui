import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convert, createSale, createSalePayment, getAgencyById, getAllBankAccount, getAllCustomers, getAllLotById, getAllMobileMoney, getAllPrints, getAllProducts, getAllSalePaymentsByCustomer, getAllSales, getAllSales_, getAllServices, getAllStocks, getCashBySlug, getCategoryService, getCategoryServiceBySlug, getCustomerById, getCustomerBySlug, getEnterpriseById, getLotBySlug, getProductBySlug, getSaleById, getServiceById, getServiceBySlug, getStock, getStoreBySlug } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { paymentMethod } from "../../data/info.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faPrint, faTrash, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../layout/Modal.jsx";
import Notification from "../../layout/Notification.jsx";
import CreateCustomer from "../customer/CreateCustomer.jsx";
import { printActions } from "../../store/print.js";
import { useNavigate } from "react-router-dom";
import { identifierMenuActions } from "../../store/identifierSlice.js";

export default function CreateSale() {
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const user = JSON.parse(localStorage.getItem("user"));
    const dialog = useRef();
    const dialog1 = useRef();
    const dialog2 = useRef();
    const dialog3 = useRef();
    const dialog4 = useRef();
    const selectCategory = useRef();
    const selectService = useRef();
    const selectPaymentReceiver = useRef();
    const selectProduct = useRef();
    const selectStore = useRef();
    const selectLot = useRef();
    const inputQuantity = useRef();
    const inputPrice = useRef();
    const selectPaymentMethod = useRef();
    const selectCustomer = useRef();
    const inputPayment_ = useRef()
    const inputDiscount = useRef();
    const inputPriceHT = useRef();
    const inputPayment__ = useRef()
    const inputRest = useRef();
    const inputPriceTtc = useRef();
    const inputPayment = useRef();
    const inputStock = useRef();
    const inputMotif = useRef()
    const inputCash = useRef()
    const customer = useSelector(state => state.identifier.customer)
    const cash = useSelector(state => state.cash)
    const navigate = useNavigate()




    const dispatch = useDispatch();
    const [animate] = useAnimate();
    const [data, setData] = useState({
        category: [],
        services: [],
        customers: [],
        categoryValue: "",
        serviceValue: "",
        productList: [],
        products: [],
        lots: [],
        stores: [],
        paymentReceiver: [],
        customer: [],
        payment: 0,
        price: 0,
        priceHT: 0,
        priceTTC: 0,
        rest: 0,
        quantity: 0,
        discount: 0,
        prevDiscount: 0,
        discounts: 0,
        tax: 0,
        errors: [],
        disabled: false,
        prints: [],
        salePayments: [],
        totalSalePayments: 0,
        instantAmount: 0,
        typePrint: "sale"

    })



    useEffect(() => {
        if (user.enterprise > 0 && user.agency > 0) {
            let tbEl = {
                tb: [],
                tb1: [],
                tb2: [],
                tb3: []
            }
            inputCash.current.value = cash
            async function get(signal) {
                const allCategories = await getCategoryService();
                const allProducts = await getAllProducts({ signal, enterprise: user.enterprise })
                const allCustomers = await getAllCustomers({ signal, enterprise: user.enterprise })
                const allPrints = await getAllPrints({ signal, enterprise: user.enterprise, agency: user.agency })

                allCategories.forEach(c => {
                    tbEl.tb.push({ key: c.id, name: c.name, value: c.slug })
                })

                allProducts.forEach(p => {
                    if (p.category === "PRODUITS" || p.category === "PACQUET") {
                        tbEl.tb1.push({ key: p.id, name: p.name, value: p.slug })
                    }

                })

                allPrints.forEach(p => {
                    if (p.status === "ACTIVE") {
                        tbEl.tb3.push({ key: p.id, name: p.type, value: p.type })
                    }

                })


                allCustomers.forEach(c => {
                    tbEl.tb2.push({ key: c.id, name: c.lastName + " " + c.firstName, value: c.slug })
                })
                setData(prev => {
                    return {
                        ...prev,
                        category: tbEl.tb,
                        productList: tbEl.tb1,
                        customers: tbEl.tb2,
                        stores: user.stores,
                        prints: tbEl.tb3,
                    }
                })

            }
            get()

        }
    }, [customer, cash])



    async function handleSave(signal) {
        let products = []
        let errors = []
        if (Number(inputPayment.current.value) > 0 && Number(inputPayment.current.value) <= Number(inputPriceTtc.current.value) && selectPaymentMethod.current.value === "ESPECES" || Number(inputPayment.current.value) > 0 && Number(inputPayment.current.value) <= Number(inputPriceTtc.current.value) && selectPaymentMethod.current.value === "VIREMENT" || Number(inputPayment.current.value) > 0 && Number(inputPayment.current.value) <= Number(inputPriceTtc.current.value) && selectPaymentMethod.current.value === "MOBILE_MONEY" || selectPaymentMethod.current.value === "A_CREDIT" || selectPaymentMethod.current.value === "AVANCE_CLIENT") {
            data.products.forEach(p => {
                products.push(p.category + ":" + p.service + ":" + p.product + ":" + p.store + ":" + p.lot + ":" + p.quantity + ":" + p.price + ":" + p.discount)
            })
            const enterprise_ = await getEnterpriseById({ id: user.enterprise, signal })
            const agency_ = await getAgencyById({ id: user.agency, signal })
            const enterprise = enterprise_.slug
            const customer = selectCustomer.current.value
            const customerData = await getCustomerBySlug({ signal, slug: customer })
            const agency = agency_.slug
            const cash = inputCash.current.value
            const paymentMethod = selectPaymentMethod.current.value
            const paymentReceiver = selectPaymentReceiver.current.value
            const priceHt = inputPriceHT.current.value
            const discount = inputDiscount.current.value
            const tax = 0
            const priceTtc = inputPriceTtc.current.value
            const payment = inputPayment.current.value

            if (customerData.lastName === "CLIENT INCONNU" && Number(inputRest.current.value) > 0) {
                errors.push("Le client inconnu ne peut pas avoir de dette.")

            }


            if (errors.length > 0) {
                dispatch(noteActions.error(true))
                dispatch(noteActions.show());
                dispatch(noteActions.relaunch());
                dispatch(noteActions.sendData(errors))
                return
            }


            const saleDto = {
                enterprise,
                agency,
                cash,
                paymentMethod,
                paymentReceiver: selectPaymentMethod.current.value !== "A_CREDIT" ? paymentReceiver : "A_CREDIT",
                products,
                discount,
                priceHt,
                tax,
                priceTtc,
                payment,
                customer,
            }

            const responseData = await createSale(saleDto)
            const amountLetter = await convert(payment)

            const state = responseHttp(responseData);
            if (state) {
                dispatch(noteActions.error(true))
            } else {
                dispatch(noteActions.error(false))
                if (responseData[0].includes("avec succès")) {
                    const sales = await getAllSales_()
                    const sale = sales[sales.length - 1]


                    const printSale = {
                        enterprise: enterprise_,
                        agency: agency_,
                        ref: sale.ref,
                        date: new Date().toLocaleDateString(),
                        time: sale.time,
                        customer: customerData.lastName + " " + customerData.firstName,
                        products: data.products,
                        priceHT: priceHt,
                        remise: discount,
                        priceTTC: priceTtc,
                        payment: payment,
                        rest: priceTtc - Number(payment),
                        cash: cash,
                        amountLetter,
                    }
                    dispatch(printActions.getPrint(printSale))
                    setData(prev => {
                        return {
                            ...prev,
                            products: [],
                            typePrint: "sale"
                        }

                    })
                    dialog4.current.open()
                }


            }
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(responseData))
        } else {
            animate(inputPayment.current, { x: [0, 15, 0] }, { bounce: 0.75 })
        }


    }



    async function handlePayment() {
        const controller = new AbortController();
        const signal = controller.signal;
        let errors = []
        if (selectPaymentMethod.current.value === "Sélectionner un moyen de paiement") {
            errors.push("Veuillez sélectionner un moyen de paiement.")
        }

        if (selectPaymentReceiver.current.value === "Sélectionner un moyen de réception") {
            errors.push("Veuillez sélectionner un moyen de réception.")
        }

        if (errors.length > 0) {
            dispatch(noteActions.error(true))
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))
            return
        }

        let salePaymentDto = {}
        const salePaymentDtos = []
        const enterprise = await getEnterpriseById({ id: user.enterprise, signal })
        const agency = await getAgencyById({ id: user.agency, signal })
        const customer = await getCustomerBySlug({ signal, slug: selectCustomer.current.value })
        const cash_ = await getCashBySlug({ slug: inputCash.current.value, signal })
        let amount = Number(inputPayment__.current.value)
        for (let s of data.salePayments) {
            salePaymentDto = {}
            if (s.status === "on") {
                if (amount > s.balance) {
                    salePaymentDto.amount = s.balance
                    salePaymentDto.advance = s.advance + s.balance
                    salePaymentDto.balance = 0
                    amount -= s.balance

                } else if (amount > 0 && amount <= s.balance) {
                    salePaymentDto.amount = amount
                    salePaymentDto.advance = s.advance + amount
                    salePaymentDto.balance = s.balance - amount
                    amount = 0
                }
                salePaymentDto.sale = s.sale
                salePaymentDto.paymentMethod = selectPaymentMethod.current.value
                salePaymentDto.paymentReceiver = selectPaymentReceiver.current.value
                salePaymentDto.cash = inputCash.current.value
                salePaymentDto.rest = s.rest
                salePaymentDto.ref = s.ref
                salePaymentDtos.push(salePaymentDto)

            }
        }

        if (salePaymentDtos.length > 0) {
            const responseData = await createSalePayment(salePaymentDtos)
            const amountLetter = await convert(Number(inputPayment__.current.value))

            const state = responseHttp(responseData);
            if (state) {
                dispatch(noteActions.error(true))
            } else {

                dispatch(noteActions.error(false))
                const printSalePayment = {
                    enterprise,
                    agency,
                    date: new Date().toLocaleDateString(),
                    time: new Date().getTime().toLocaleString(),
                    customer: customer.lastName + " " + customer.firstName,
                    salePayments: salePaymentDtos,
                    payment: inputPayment__.current.value,
                    cash: cash_,
                    amountLetter,
                }
                dispatch(printActions.getPrint(printSalePayment))
                setData(prev => {
                    return {
                        ...prev,
                        salePayments: [],
                        typePrint: "salePayement"
                    }

                })
                dialog4.current.open()

            }
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(responseData))
        }

    }


    function handleBlur(field, value) {

        if (field === "quantity") {
            if (value <= 0) {
                animate(inputQuantity.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "price") {
            if (value <= 0) {
                animate(inputPrice.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "discount") {
            if (value == "") {
                value = 0
            }
            if (data.priceHT > 0 && data.priceHT > Number(value)) {
                const prevDiscount = data?.prevDiscount
                const discounts = data?.discounts - prevDiscount
                const priceTTC = data.priceHT - Number(value)
                inputPriceTtc.current.value = priceTTC
                inputDiscount.current.value = discounts + Number(value)
                inputRest.current.value = inputPriceTtc.current.value - inputPayment_.current.value
                setData(prev => {
                    return {
                        ...prev,
                        priceTTC,
                        discounts: discounts + Number(value),
                    }
                })
            } else {
                const discounts = data?.discounts
                setData(prev => {
                    return {
                        ...prev,
                        discounts,
                    }
                })
                dialog1.current.open()

            }

        }


        if (field === "payment") {
            if (value == "") {
                value = 0
            }
            if (Number(value) <= Number(inputPriceTtc.current.value)) {
                inputPayment_.current.value = Number(value)
                inputRest.current.value = Number(inputPriceTtc.current.value) - Number(inputPayment_.current.value)
            } else {
                inputPayment.current.value = Number(0)
                inputPayment_.current.value = Number(0)
                inputRest.current.value = Number(inputPriceTtc.current.value) - Number(inputPayment_.current.value)
                animate(inputPayment.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }



        }

    }


    async function handleChange(identifier, value, signal) {
        let tbEl = {
            tb: []
        }

        if (identifier === "customer") {
            const allSalePayments = await getAllSalePaymentsByCustomer({ signal, customer: value })
            let tb = []
            let totalSalePayments = 0
            for (let s of allSalePayments) {
                if (s.balance > 0) {
                    totalSalePayments += s.balance
                    const sale = await getSaleById({ signal, id: s.sale })
                    tb.push({ id: s.id, sale: s.sale, ref: sale.ref, rest: sale.rest, advance: s.advance, balance: s.balance, status: "off" })
                }
            }
            setData(prev => {
                return {
                    ...prev,
                    salePayments: tb,
                    totalSalePayments
                }
            })

        }


        if (identifier === "category") {
            const category = await getCategoryServiceBySlug({ signal, slug: value })
            const services = await getAllServices({ signal, enterprise: user.enterprise, category: category.id })
            services.forEach(s => {

                tbEl.tb.push({ key: s.id, name: s.name, value: s.slug })

            })
            setData(prev => {
                return {
                    ...prev,
                    services: tbEl.tb,
                    categoryValue: value
                }
            })
        }

        if (identifier === "service") {

            if (value != "ventes") {
                const service = await getServiceBySlug({ signal, slug: value })
                inputQuantity.current.value = 1
                inputQuantity.current.readOnly = true
                inputPrice.current.value = service.price
                inputMotif.current.value = value
            }

            setData(prev => {
                return {
                    ...prev,
                    serviceValue: value
                }
            })
        }

        if (identifier === "paymentMethod") {
            if (value === "ESPECES") {
                setData(prev => {
                    return {
                        ...prev,
                        paymentReceiver: user.cashes
                    }
                })
            }

            if (value === "A_CREDIT") {
                inputPayment.current.readOnly = true
            }

            if (value === "VIREMENT") {
                const bankAccounts = await getAllBankAccount({ signal, agency: user.agency })
                bankAccounts.forEach(b => {
                    tbEl.tb.push({ key: b.id, name: b.rib, value: b.slug })
                })
                setData(prev => {
                    return {
                        ...prev,
                        paymentReceiver: tbEl.tb
                    }
                })
            }

            if (value === "MOBILE_MONEY") {
                const mobileMoney = await getAllMobileMoney({ signal, agency: user.agency })
                mobileMoney.forEach(m => {
                    tbEl.tb.push({ key: m.id, name: m.phone, value: m.slug })
                })
                setData(prev => {
                    return {
                        ...prev,
                        paymentReceiver: tbEl.tb
                    }
                })
            }

            setData(prev => {
                return {
                    ...prev,
                    paymentMethod: value
                }
            })

        }

        if (identifier === "product") {
            let tb1 = []
            const product = await getProductBySlug({ signal, slug: value })
            const store = selectStore?.current.value != "Sélectionner un magasin" ? await getStoreBySlug({ slug: selectStore?.current.value, signal }) : undefined
            if (store != undefined) {
                const allStocks = await getAllStocks({ signal, enterprise: user.enterprise, agency: user.agency, storePrincipal: 0, store: store.id, product: product.id, lot: 0 })
                allStocks.forEach(p => {
                    tb1.push(p.lot)
                })

            }

            const allLots = await getAllLotById(tb1)
            allLots.forEach(l => {
                tbEl.tb.push({ key: l.id, name: l.name, value: l.slug })
            })

            setData(prev => {
                return {
                    ...prev,
                    lots: tbEl.tb,
                }
            })
            inputPrice.current.value = product.sellingPrice || 0
        }


        if (identifier === "store") {
            let tb1 = []
            const store = await getStoreBySlug({ slug: value, signal })
            const product = await getProductBySlug({ signal, slug: selectProduct.current.value })
            const allStocks = await getAllStocks({ signal, enterprise: user.enterprise, agency: user.agency, storePrincipal: 0, store: store.id, product: product.id, lot: 0 })
            allStocks.forEach(p => {
                tb1.push(p.lot)
            })

            const allLots = await getAllLotById(tb1)
            allLots.forEach(l => {

                tbEl.tb.push({ key: l.id, name: l.name, value: l.slug })
            })

            setData(prev => {
                return {
                    ...prev,
                    lots: tbEl.tb,
                }
            })
        }


        if (identifier === "lot") {
            const product = await getProductBySlug({ signal, slug: selectProduct.current.value })
            const enterprise = await getEnterpriseById({ id: user.enterprise })
            const agency = await getAgencyById({ id: user.agency, signal })
            const store = await getStoreBySlug({ slug: selectStore.current.value, signal })
            const lot = await getLotBySlug({ signal, slug: value })
            const stock = await getStock({ signal, enterprise: enterprise.id, agency: agency.id, storePrincipal: 0, store: store.id, product: product.id, lot: lot.id })
            inputStock.current.value = stock.stock || 0
        }

    }


    async function handleAdd(identifier, signal) {

        let errors = []
        if (identifier === "add") {
            if (selectCategory.current.value === "Sélectionner une catégorie") {
                errors.push("Veuillez sélectionner une catégorie")
            }

            if (selectService.current.value === "Sélectionner un service") {
                errors.push("Veuillez sélectionner un service")
            }

            if (selectPaymentMethod.current.value === "Sélectionner un moyen de paiement") {
                errors.push("Veuillez sélectionner un moyen de paiement")
            }

            if ((selectPaymentMethod.current.value === "ESPECES" || selectPaymentMethod.current.value === "VIREMENT" || selectPaymentMethod.current.value === "MOBILE_MONEY") && selectPaymentReceiver === "Sélectionner un receveur") {
                errors.push("Veuillez sélectionner un moyen de réception")
            }




            if (selectService.current.value === "ventes") {
                if (selectProduct.current.value === "Sélectionner un produit") {
                    errors.push("Veuillez sélectionner un produit")
                }

                if (selectStore.current.value === "Sélectionner un magasin") {
                    errors.push("Veuillez sélectionner un magasin")
                }

                if (selectLot.current.value === "Sélectionner un lot") {
                    errors.push("Veuillez sélectionner un lot")
                }

                const enterprise = await getEnterpriseById({ id: user.enterprise, signal })
                const agency = await getAgencyById({ id: user.agency, signal })
                const store = await getStoreBySlug({ slug: selectStore.current.value, signal })
                const lot = await getLotBySlug({ signal, slug: selectLot.current.value })
                const product = await getProductBySlug({ signal, slug: selectProduct.current.value })
                const stock = await getStock({ signal, enterprise: enterprise.id, agency: agency.id, storePrincipal: 0, store: store.id, product: product.id, lot: lot.id })

                if (inputQuantity.current.value > Number(stock.stock)) {
                    errors.push("Le stock de " + selectProduct.current.value + " est insuffisant dans le magasin " + selectStore.current.value)
                }



                if (inputQuantity.current.value === "" || inputQuantity.current.value <= 0) {
                    errors.push("Veuillez renseigner une quantité valida")
                }

                if (inputPrice.current.value === "" || inputPrice.current.value <= 0) {
                    errors.push("Veuillez renseigner le prix")
                }

                if ((Number(product.stock) - Number(inputQuantity.current.value)) <= product.securityStock) {
                    dialog3.current.open()
                }
            }


        }



        if (errors.length > 0) {
            setData(prev => {
                return {
                    ...prev,
                    errors
                }
            })
            return { errors: data.errors }
        }


        let products = [...data.products]
        let discount = 0;
        for (let p of products) {
            discount += p.discount
        }
        let length = data.products.length

        let productNames = products.map(p => p.product);
        if (selectService.current.value === "ventes") {
            if (productNames.includes(selectProduct.current.value)) {
                dialog.current.open();
                return { errors }
            }
        }

        products.push({ id: length + 1, category: selectCategory.current.value, service: selectService.current.value, store: selectStore.current?.value || "", lot: selectLot.current?.value || "", product: selectProduct.current?.value || selectService.current?.value, quantity: Number(inputQuantity.current.value), price: Number(inputPrice.current.value), discount: 0 })

        let priceHT = 0;
        let priceTTC = 0;
        let payment = data?.payment
        products.forEach(p => {
            priceHT += (p.quantity * p.price)
            priceTTC += (p.quantity * p.price)
        })


        if (data.products.length > 0) {
            inputPriceHT.current.value = priceHT || 0
            inputPriceTtc.current.value = priceTTC || 0
            inputRest.current.value = Number(inputPriceTtc.current.value) - Number(inputPayment.current.value)

        }

        setData(prev => {
            return {
                ...prev,
                products,
                priceHT,
                priceTTC,
                discount,
                rest: priceTTC - payment
            }
        })



        return { errors: null }
    }


    function handleDelete(value) {
        let products = [...data.products]
        products = products.filter(p => p.id !== value)
        let priceHT = 0;
        let priceTTC = 0;
        products.forEach(p => {
            priceHT += (p.quantity * p.price)
            priceTTC += (p.quantity * p.price)

        })
        inputPriceHT.current.value = priceHT
        inputPriceTtc.current.value = priceTTC
        inputRest.current.value = Number(inputPriceTtc.current.value) - Number(inputPayment.current.value)

        setData(prev => {
            return {
                ...prev,
                products,
                priceHT,
                priceTTC,
            }
        })

    }

    function handleClick(identifier, value) {
        if (identifier == "customer") {
            dialog2.current.open()
        }

    }


    function handleSelect(identifier, value, id) {
        const salePayments = [...data.salePayments]
        let totalSalePayments = 0
        let instantAmount = data?.instantAmount
        if (identifier == "all") {
            if (value == true) {
                for (let s of salePayments) {
                    s.status = "on"
                    totalSalePayments += s.balance
                    instantAmount = totalSalePayments
                }

            } else if (value == false) {
                for (let s of salePayments) {
                    s.status = "off"
                    totalSalePayments = 0
                    instantAmount = 0

                }

            }

        } else if (identifier == "one") {
            totalSalePayments = data?.instantAmount
            if (value == true) {
                for (let s of salePayments) {
                    if (s.id === id) {
                        s.status = "on"
                        totalSalePayments += s.balance
                        instantAmount += s.balance
                    }

                }

            } else if (value == false) {
                for (let s of salePayments) {

                    if (s.id === id) {
                        s.status = "off"
                        totalSalePayments -= s.balance
                        instantAmount -= s.balance
                    }
                }

            }

        }
        setData(prev => {
            return {
                ...prev,
                salePayments,
                instantAmount,
            }
        })
        inputPayment__.current.value = totalSalePayments
    }



    function handleUp(identifier, value) {
        if (identifier === "discount") {
            const discounts = data?.discounts
            setData(prev => {
                return {
                    ...prev,
                    prevDiscount: discounts
                }

            })
        }
    }

    function handleSelectionPrint(value) {
        dispatch(identifierMenuActions.updatePrint({ print: value }))
        dispatch(identifierMenuActions.updateDuplicata({ duplicata: false }))
        if (data?.typePrint === "sale") {
            navigate("/print-sale")
        } else if (data?.typePrint === "salePayement") {
            navigate("/print-sale-payment")
        }

    }





    return <>

        <div className="w-full h-full flex overflow-x-auto">
            <div className="w-1/2 p-4 m-1 border-2 border-sky-950 flex flex-col items-center gap-2 shadow-lg shadow-sky-950">
                <div className="flex justify-center gap-2 w-full mb-2">
                    <Select label="Client *" id="customer" name="customer" selectedTitle="Sélectionner un client" data={data?.customers} ref={selectCustomer} onChange={(e) => handleChange("customer", e.target.value)} disabled={data?.disabled} />
                    <button className="cursor-pointer" onClick={() => handleClick("customer")}><FontAwesomeIcon icon={faUserGroup} /></button>
                    <Input label="Caisse *" type="text" defaultValue={data?.cash} name="cash" placeholder="Caisse" className="border border-sky-950" ref={inputCash} readOnly />
                </div>
                <div className="flex justify-center gap-2 w-full">
                    <Select label="Moyen paiement *" id="paymentMethod" name="paymentMethod" selectedTitle="Sélectionner un moyen de paiement" data={paymentMethod} ref={selectPaymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)} disabled={data?.disabled} />
                    <Select label="Moyen réception *" id="paymentReceiver" name="paymentReceiver" selectedTitle="Sélectionner un moyen de réception" data={data?.paymentReceiver} ref={selectPaymentReceiver} disabled={data?.paymentMethod === "A_CREDIT" || data?.paymentMethod === "AVANCE_CLIENT" || data?.disabled} />
                </div>
                <div className="flex justify-center gap-2 w-full">
                    <Select label="Catégorie *" id="category" name="category" selectedTitle="Sélectionner une catégorie" data={data?.category} ref={selectCategory} onChange={(e) => handleChange("category", e.target.value)} />
                    <Select label="Service *" id="service" name="service" selectedTitle="Sélectionner un service" data={data?.services} ref={selectService} onChange={(e) => handleChange("service", e.target.value)} />
                </div>
                {data?.categoryValue === "ventes" && data?.serviceValue === "ventes" ? <><div className="flex justify-center gap-2 w-full">
                    <Select label="Produit *" id="product" name="product" selectedTitle="Sélectionner un produit" data={data?.productList} ref={selectProduct} onChange={(e) => handleChange("product", e.target.value)} />
                    <Select label="Magasin *" id="store" name="store" selectedTitle="Sélectionner un magasin" data={data?.stores} ref={selectStore} onChange={(e) => handleChange("store", e.target.value)} />
                </div>

                    <div className="flex justify-center gap-2 w-full">
                        <Select label="Lot *" id="lot" name="lot" selectedTitle="Sélectionner un lot" data={data?.lots} ref={selectLot} onChange={(e) => handleChange("lot", e.target.value)} />
                        <Input label="Stock *" type="number" name="stock" placeholder="Stock" className="border border-sky-950" ref={inputStock} readOnly />
                    </div></> : <textarea type="text" className="border h-1/2 w-full rounded p-1" placeholder="Motif du service" ref={inputMotif}>

                </textarea>}
                <div className="flex justify-center gap-2 w-full">
                    <Input label="Quantité *" type="number" defaultValue={data?.quantity} name="quantity" placeholder="Quantité" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputQuantity} />
                    <Input label="Prix *" type="number" defaultValue={data?.price} name="price" placeholder="Prix" className="border border-sky-950" onBlur={(event) => handleBlur("price", event.target.value)} ref={inputPrice} />
                </div>
                {inputCash.current?.value != "" ? <Submit onClick={() => handleAdd("add")}>
                    Ajouter
                </Submit> : <p className="text-red-500 font-bold"><FontAwesomeIcon icon={faExclamationTriangle} className="me-4" />Caisse non sélectionnéé</p>}
                {data?.errors.length > 0 && <ul>
                    {data.errors.map(e => <li key={e} className="text-red-500">{e}</li>)}
                </ul>}
            </div>
            <div className="w-1/2 p-2 m-1 border-2 border-sky-950 shadow-lg shadow-sky-950 text-2xs">
                <table className="w-full overflow-x">
                    <thead>
                        <tr className="bg-sky-950 text-sky-50">
                            <th className="border  hidden">
                                Categorie
                            </th>
                            <th className="border  hidden">
                                Service
                            </th>
                            <th className="border hidden">
                                Magasin
                            </th>
                            <th className="border hidden">
                                Lot
                            </th>
                            <th className="border px-2">
                                id
                            </th>
                            <th className="border px-6">
                                produit
                            </th>
                            <th className="border px-2">
                                Quantité
                            </th>
                            <th className="border">
                                Prix
                            </th>
                            <th className="border">
                                Rémise
                            </th>
                            <th className="border">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.products.length > 0 && data.products.map(p => <tr key={p.product}>
                            <td className="border border-sky-950 text-center hidden">{p.category}</td>
                            <td className="border border-sky-950 text-center hidden">{p.service}</td>
                            <td className="border border-sky-950 text-center hidden">{p.store}</td>
                            <td className="border border-sky-950 text-center hidden">{p.lot}</td>
                            <td className="border border-sky-950 text-center">{p.id}</td>
                            <td className="border border-sky-950 text-center">{p.product}</td>
                            <td className="border border-sky-950 text-center">{p.quantity}</td>
                            <td className="border border-sky-950 text-center">{p.price}</td>
                            <td className="border border-sky-950 text-center"><input type="number" defaultValue={p.discount} className="border text-center w-24" onClick={(e) => handleUp("discount", e.target.value)} onBlur={(e) => handleBlur("discount", e.target.value)} /></td>
                            <td className="border border-sky-950 text-center"><FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-500" onClick={() => handleDelete(p.id)} /></td>
                        </tr>)}
                    </tbody>

                </table>
                {data.products.length > 0 && <>
                    <div className="mt-4 flex gap-2 justify-end">
                        <label htmlFor="payment" className="font-medium">Acompte *</label>
                        <input type="number" defaultValue={data?.payment} name="payment" placeholder="Acompte" className="border border-sky-950 rounded text-end w-24 shadow-md shadow-sky-950" ref={inputPayment} onBlur={(e) => handleBlur("payment", e.target.value)} />
                    </div>
                    <div className="flex justify-center mt-4 gap-4 mb-2 border p-2 rounded">

                        <div className="flex flex-col">
                            <label htmlFor="priceHT" className="font-medium">Prix HT</label>
                            <input type="number" defaultValue={data?.priceHT} name="priceHT" placeholder="Prix HT" className="border border-sky-950 rounded text-end w-24 shadow-md shadow-sky-950" ref={inputPriceHT} readOnly />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="discount" className="font-medium">Rémise</label>
                            <input type="number" defaultValue={data?.discounts} name="discounts" placeholder="Rémise" className="border border-sky-950 rounded text-end w-24 shadow-md shadow-sky-950" ref={inputDiscount} readOnly />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="priceTTC" className="font-medium">Prix TTC</label>
                            <input type="number" defaultValue={data?.priceTTC} name="priceTTC" placeholder="Prix TTC" className="border border-sky-950 rounded text-end w-24 shadow-md shadow-sky-950" ref={inputPriceTtc} readOnly />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="payment_" className="font-medium">Acompte</label>
                            <input type="number" defaultValue={data?.payment} name="Acompte" placeholder="Acompte" className="border border-sky-950 rounded text-end w-24 shadow-md shadow-sky-950" readOnly ref={inputPayment_} />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="rest" className="font-medium">Reste à payer</label>
                            <input type="number" defaultValue={data?.rest} name="Acompte" placeholder="Reste" className="border border-sky-950 rounded text-end w-24 shadow-md shadow-sky-950" readOnly ref={inputRest} />
                        </div>

                    </div>

                    <div className="flex justify-end">
                        <Submit onClick={() => handleSave()}>
                            Enregistrer
                        </Submit>
                    </div>


                </>


                }
                {data?.salePayments.length > 0 && <div className="flex gap-4 justify-center mt-4"><table className="w-2/3 mb-4">
                    <thead>
                        <tr className="bg-sky-950 text-sky-50">
                            <th className="border">
                                id
                            </th>
                            <th className="border hidden">
                                sale
                            </th>
                            <th className="border">
                                Réf.
                            </th>
                            <th className="border">
                                Dettes
                            </th>
                            <th className="border">
                                Avance
                            </th>
                            <th className="border">
                                Solde
                            </th>
                            <th className="border py-1 flex items-center justify-center">
                                Action <input type="checkbox" className="ms-2" onClick={(e) => handleSelect("all", e.target.checked)} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.salePayments.map(s => <tr key={s.id}>
                            <td className="border border-sky-950 text-center p-1">{s.id}</td>
                            <td className="border border-sky-950 text-center p-1 hidden">{s.sale}</td>
                            <td className="border border-sky-950 text-center p-1">{s.ref}</td>
                            <td className="border border-sky-950 text-center p-1">{Number(s.rest).toLocaleString()}</td>
                            <td className="border border-sky-950 text-center p-1">{Number(s.advance).toLocaleString()}</td>
                            <td className="border border-sky-950 text-center p-1">{Number(s.balance).toLocaleString()}</td>
                            <td className="border border-sky-950 text-center p-1"><input type="checkbox" checked={s.status === "on"} onClick={(e) => handleSelect("one", e.target.checked, s.id)} /></td>
                        </tr>)}
                    </tbody>
                    <tfoot>
                        <tr className="bg-sky-950 text-sky-50">
                            <td colSpan="3" className="border text-center p-1"></td>
                            <td colSpan="2" className="border text-center p-1">Total</td>
                            <td colSpan="2" className="border text-center p-1">{Number(data?.totalSalePayments).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
                    <div className="flex flex-col gap-4 items-center">
                        <div className="flex flex-col">
                            <label htmlFor="payment_" className="font-medium">Montant versé</label>
                            <input type="number" id="payment_" placeholder="Montant versé" className="border border-sky-950 rounded text-end shadow-md shadow-sky-950 p-1" ref={inputPayment__} />

                        </div>
                        <Submit onClick={handlePayment}>
                            Enregistrer
                        </Submit>
                    </div>
                </div>}
            </div>

        </div >

        <Modal ref={dialog} title="Produit existant" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Ce produit existe déjà dans le panier.</p>
            <Submit onClick={() => dialog.current.close()}>Fermer</Submit>
        </Modal>

        <Modal ref={dialog1} title="Montant Rémise incorrect" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Le montant de la remise est incorrect.</p>
            <Submit onClick={() => dialog1.current.close()}>Fermer</Submit>
        </Modal>

        <Modal ref={dialog2} title="Créer un nouveau client" size="lg:h-5/9 lg:w-8/15">
            <CreateCustomer />
        </Modal>


        <Modal ref={dialog3} title="Alerte stock" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Attention le stock de sécurité est atteint. Veuillez approvisionner votre stock</p>
            <Submit onClick={() => dialog3.current.close()}>Fermer</Submit>
        </Modal>

        <Modal ref={dialog4} title="Sélection du format d'impression" size="h-2/5 ">
            {data.prints.length > 0 ? <div className="flex flex-col items-center justify-center gap-4 mb-4">
                {data.prints.map(p => <button key={p.id} className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
                    <FontAwesomeIcon icon={faPrint} className="me-2"></FontAwesomeIcon>
                    {p.name}
                </button>)}
            </div> : <button className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950 mb-4" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
                IMPRIMANTE_LASER
            </button>}
            <Submit onClick={() => dialog4.current.close()}>Fermer</Submit>
        </Modal>


        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}