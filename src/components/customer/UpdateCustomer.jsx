
import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convert, createSalePayment, getAgencyById, getAllBankAccount, getAllEngagementsByCustomer, getAllInvoiceByCustomer, getAllMobileMoney, getAllMvtCashByCustomerAndAdvance, getAllPrints, getAllSalePaymentsByCustomer, getAllSalesByCustomer, getCashById, getCashBySlug, getCustomerById, getEnterpriseById, getSaleById, queryClient, updateCustomer } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { genders, paymentMethodPayement } from "../../data/info.js";
import Modal from "../../layout/Modal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faPrint } from "@fortawesome/free-solid-svg-icons";
import { printActions } from "../../store/print.js";
import { identifierMenuActions } from "../../store/identifierSlice.js";
import { useNavigate } from "react-router-dom";
import CreatePayment from "../payment/CreatePayment.jsx";
import { modalActions } from "../../store/modalSlice.js";
import Notification from "../../layout/Notification.jsx";

export default function UpdateCustomer() {
    const user = JSON.parse(localStorage.getItem("user"))
    const id = useSelector(state => state.modal.value)
    const dialog = useRef()
    const dialog1 = useRef()
    const dialog2 = useRef()
    const cash = useSelector(state => state.cash)
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const navigate = useNavigate()

    const inputFirstName = useRef();
    const inputLastName = useRef();
    const inputEmail = useRef();
    const inputPhone = useRef();
    const inputPhone2 = useRef();
    const inputAddress = useRef();
    const inputDateBirth = useRef();
    const inputPlaceBirth = useRef();
    const inputEnterprise = useRef();
    const selectGender = useRef()
    const inputPayment__ = useRef()
    const selectPaymentMethod = useRef()
    const selectPaymentReceiver = useRef()

    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        customer: {},
        enterprise: "",
        selection: "Achats",
        sales: {},
        prints: [],
        invoices: [],
        salePayments: [],
        borrow: [],
        loan: [],
        advances: [],
        totalSalePayments: 0,
        typePrint: "sale",
        paymentMethod: "",
        paymentReceiver: [],
        totalPriceSale: {
            priceHT: 0,
            discount: 0,
            priceTTC: 0,
            payment: 0,
            rest: 0
        },
        totalInvoice: {
            amount: 0,
            advance: 0,
            balance: 0,
        },
        totalAdvance: {
            amount: 0
        }
    })

    useEffect(() => {
        if (id != "") {
            async function get(signal) {
                let tb = []
                let tb1 = []
                let tb2 = []
                let tb3 = []
                let tb4 = []
                let tb5 = []
                let tb6 = []
                let totalSalePayments = 0
                const customer_ = await getCustomerById({ signal, id })
                const allSales = await getAllSalesByCustomer({ signal, customer: id });
                const allInvoices = await getAllInvoiceByCustomer({ signal, customer: id })
                const allSalePayments = await getAllSalePaymentsByCustomer({ signal, customer: customer_.slug })
                const allEngagements = await getAllEngagementsByCustomer({ signal, tiers: customer_.ref })
                const allMvtCashes = await getAllMvtCashByCustomerAndAdvance({ signal, customer: customer_.slug })
                const enterprise_ = await getEnterpriseById({ id: user.enterprise, signal })
                let totalPriceSale = {
                    priceHT: 0,
                    discount: 0,
                    priceTTC: 0,
                    payment: 0,
                    rest: 0
                }
                let totalInvoice = {
                    amount: 0,
                    advance: 0,
                    balance: 0,
                }
                let totalAdvance = {
                    amount: 0
                }
                allSales.forEach(s => {
                    totalPriceSale.priceHT += s.priceHt
                    totalPriceSale.discount += s.discount
                    totalPriceSale.priceTTC += s.priceTtc
                    totalPriceSale.payment += s.payment
                    totalPriceSale.rest += s.rest
                    tb.push({ id: s.id, dateTransaction: s.dateTransaction, ref: s.ref, priceHt: s.priceHt, discount: s.discount, priceTtc: s.priceTtc, payment: s.payment, rest: s.rest })
                })

                allInvoices.forEach(s => {
                    totalInvoice.amount += s.amount
                    totalInvoice.advance = +s.advance
                    totalInvoice.balance += s.balance
                    tb2.push({ id: s.id, dateTransaction: s.dateTransaction, ref: s.ref, amount: s.amount, advance: s.advance, balance: s.balance, status: s.statusInvoice })
                })



                for (let s of allSalePayments) {
                    if (s.balance > 0) {
                        totalSalePayments += s.balance
                        const sale = await getSaleById({ signal, id: s.sale })
                        tb3.push({ id: s.id, sale: s.sale, ref: sale.ref, rest: sale.rest, advance: s.advance, balance: s.balance, status: "off" })
                    }
                }
                const allPrints = await getAllPrints({ signal, enterprise: user.enterprise, agency: user.agency })

                allPrints.forEach(p => {
                    if (p.status === "ACTIVE") {
                        tb1.push({ key: p.id, name: p.type, value: p.type })
                    }
                })


                allEngagements.forEach(s => {
                    if (s.typeEngagement === "EMPRUNT") {
                        tb4.push({ id: s.id, ref: s.ref, amount: s.amount, advance: s.advance, balance: s.balance })
                    } else if (s.typeEngagement === "PRET") {
                        tb5.push({ id: s.id, ref: s.ref, amount: s.amount, advance: s.advance, balance: s.balance })
                    }

                })

                allMvtCashes.forEach(s => {
                    totalAdvance.amount += s.amount
                    tb6.push({ id: s.id, dateTransaction: s.dateTransaction, ref: s.ref, amount: s.amount })

                })

                setData(prev => {
                    return { ...prev, enterprise: enterprise_.slug, customer: customer_, sales: tb, prints: tb1, invoices: tb2, salePayments: tb3, totalSalePayments, borrow: tb4, loan: tb5, advances: tb6, totalPriceSale, totalInvoice, totalAdvance }
                })
            }
            get()
        }
    }, [id])



    async function handleSubmit(prevState, formData, signal) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const firstName = formData.get("firstName")
        const lastName = formData.get("lastName")
        const email = formData.get("email")
        const phone = formData.get("phone")
        const address = formData.get("address")
        const gender = formData.get("gender")
        const dateBirth = formData.get("dateBirth")
        const placeBirth = formData.get("placeBirth")
        const enterprise = formData.get("enterprise")


        if (!isNotEmpty(firstName)) {
            animate(inputFirstName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le prénom.")
        }

        if (!isNotEmpty(enterprise)) {
            animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Aucune entreprise disponible.")
        }

        if (!isNotEmpty(lastName)) {
            animate(inputLastName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le prénom.")
        }

        if (!isNotEmpty(email)) {
            animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner l'adresse email.")
        }

        if (!isNotEmpty(phone)) {
            animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nº de téléphone.")
        }

        if (!isNotEmpty(address)) {
            animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner l'adresse.")
        }

        if (!isNotEmpty(placeBirth)) {
            animate(inputPlaceBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le lieu de naissance.")
        }

        if (dateBirth === null) {
            animate(inputDateBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la date de naissance.")
        }


        if (gender === null) {
            animate(selectGender.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner le genre.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {

                errors
            }
        }

        const customer = await getCustomerById({ signal, id })

        mutate({ slug: customer.slug, customerDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateCustomer,
        onSuccess: (responseData) => {
            const state = responseHttp(responseData);
            if (state) {
                dispatch(noteActions.error(true))
            } else {
                dispatch(noteActions.error(false))
            }
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(responseData))
            queryClient.cancelQueries(["customers"])
        }
    })


    function handleBlur(field, value) {

        if (field === "firstName") {
            if (!isNotEmpty(value)) {
                animate(inputFirstName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "lastName") {
            if (!isNotEmpty(value)) {
                animate(inputLastName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "email") {
            if (!isNotEmpty(value)) {
                animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "phone") {
            if (!isNotEmpty(value)) {
                animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "phone2") {
            if (!isNotEmpty(value)) {
                animate(inputPhone2.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "address") {
            if (!isNotEmpty(value)) {
                animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }



        if (field === "placeBirth") {
            if (!isNotEmpty(value)) {
                animate(inputPlaceBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }


    function handleModal() {
        dialog.current.open()
    }

    function handleSelection(value) {
        setData(prev => {
            return {
                ...prev,
                selection: value
            }
        })
    }

    async function handleChange(identifier, value, signal) {
        let tbEl = {
            tb: []
        }
        if (identifier === "search") {
            const sales = await getAllSalesByCustomer({ signal, customer: id })
            let tb = value !== "" ? sales.filter(s => s.id === Number(value)) : sales
            if (tb.length == 0) {
                tb = value !== "" ? sales.filter(s => s.ref.includes(value.toUpperCase())) : sales
            }
            if (tb.length == 0) {
                tb = value !== "" ? sales.filter(s => s.dateTransaction === value) : sales
            }
            setData(prev => {
                return {
                    ...prev,
                    sales: tb
                }
            })
        }

        if (identifier === "search_invoice") {
            const invoices = await getAllInvoiceByCustomer({ signal, customer: id })
            let tb = value !== "" ? invoices.filter(s => s.id === Number(value)) : invoices
            if (tb.length == 0) {
                tb = value !== "" ? invoices.filter(s => s.ref.includes(value.toUpperCase())) : invoices
            }
            if (tb.length == 0) {
                tb = value !== "" ? invoices.filter(s => s.dateTransaction === value) : invoices
            }
            setData(prev => {
                return {
                    ...prev,
                    invoices: tb
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
    }


    async function handlePrint(identifier, idEl, signal) {
        if (identifier === "sale") {
            const sale = await getSaleById({ signal, id: idEl })
            const enterprise = await getEnterpriseById({ id: sale.enterprise, signal })
            const agency = await getAgencyById({ id: sale.agency, signal })
            const amountLetter = await convert(sale.payment)
            const cash = await getCashById({ id: sale.cash, signal })
            const customer = await getCustomerById({ signal, id: sale.customer })
            const products = []
            let id = 1
            for (let p of sale.products) {
                const items = p.split(":")
                products.push({ id, category: items[0], service: items[1], product: items[2], store: items[3], lot: items[4], quantity: Number(items[5]), price: Number(items[6]), discount: Number(items[7]) })
                id++
            }

            const printSale = {
                enterprise,
                agency,
                ref: sale.ref,
                date: sale.dateTransaction,
                time: sale.time,
                customer: customer.lastName + " " + customer.firstName,
                products: products,
                priceHT: sale.priceHt,
                remise: sale.discount,
                priceTTC: sale.priceTtc,
                payment: sale.payment,
                rest: sale.rest,
                amountLetter,
                cash: cash.slug
            }
            dispatch(printActions.getPrint(printSale))
            dialog1.current.open()
        }
    }


    function handleSelectionPrint(value) {
        dispatch(identifierMenuActions.updatePrint({ print: value }))
        if (data?.typePrint === "sale") {
            dispatch(identifierMenuActions.updateDuplicata({ duplicata: true }))
            navigate("/print-sale")
        } else if (data?.typePrint === "salePayement") {
            navigate("/print-sale-payment")
        }

    }

    function handleOpenPayment(value) {
        dispatch(modalActions.updateValue(value))
        dialog2.current.open()
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

        if (!isNotEmpty(cash)) {
            errors.push("Veuillez sélectionner une caisse.")
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
        const customer = await getCustomerById({ signal, id })
        const enterprise = await getEnterpriseById({ id: user.enterprise, signal })
        const agency = await getAgencyById({ id: user.agency, signal })
        const cash_ = await getCashBySlug({ slug: cash, signal })
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
                salePaymentDto.cash = cash
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
                dialog1.current.open()

            }
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(responseData))
        }

    }



    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>


            <div className="flex justify-between gap-2">
                <Input label="Nom *" id="lastName" type="text" defaultValue={data?.customer.lastName} name="lastName" placeholder="Nom" className="border border-sky-950" onBlur={(event) => handleBlur("lastName", event.target.value)} ref={inputLastName} />
                <Input label="Prénom *" id="firstName" type="text" defaultValue={data?.customer.firstName} name="firstName" placeholder="Prénom" className="border border-sky-950" onBlur={(event) => handleBlur("firstName", event.target.value)} ref={inputFirstName} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Date naissance*" id="dateBirth" type="date" defaultValue={data?.customer.dateBirth} name="dateBirth" placeholder="Date de naissance" className="border border-sky-950" onBlur={(event) => handleBlur("dateBirth", event.target.value)} ref={inputDateBirth} />
                <Input label="Lieu de naissance*" id="placeBirth" type="text" defaultValue={data?.customer.placeBirth} name="placeBirth" placeholder="Lieu de naissance" className="border border-sky-950" onBlur={(event) => handleBlur("placeBirth", event.target.value)} ref={inputPlaceBirth} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Tél.*" id="phone" type="text" defaultValue={data?.customer.phone} name="phone" placeholder="Nº de téléphone" className="border border-sky-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
                <Input label="Tél2." id="phone2" type="text" defaultValue={data?.customer.phone2} name="phone2" placeholder="Nº de téléphone 2" className="border border-sky-950" onBlur={(event) => handleBlur("phone2", event.target.value)} ref={inputPhone2} />
            </div>


            <div className="flex justify-between gap-2">
                <Input label="Email *" id="email" type="email" defaultValue={data?.customer.email} name="email" placeholder="Email" className="border border-sky-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
                <Select label="Genre *" id="gender" name="gender" selectedTitle="Sélectionner un genre" data={genders} ref={selectGender} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Adresse *" id="adress" type="text" defaultValue={data?.customer.address} name="address" placeholder="Adresse" className="border border-sky-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputAddress} />
                <Input label="Entreprise *" id="enterprise" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" readOnly />

            </div>
            {data.customer.lastName !== "CLIENT INCONNU" && <Submit>
                Enregistrer
            </Submit>}
        </form>
        {data.customer.lastName !== "CLIENT INCONNU" && <div className="absolute bottom-5 right-5">
            <Submit onClick={handleModal}>
                Listing des opérations
            </Submit>
        </div>}

        <Modal ref={dialog} title="Historique des opérations" size="h-5/5 w-full">
            <div className="flex gap-4 p-2 bg-sky-950 text-sky-50 rounded">
                <button className="px-5 cursor-pointer hover:border-b-4 hover:border-sky-50 focus:border-b-4 focus:border-sky-50" onClick={(e) => handleSelection(e.target.textContent)}>
                    Achats
                </button>
                <button className="px-5 cursor-pointer hover:border-b-4 hover:border-sky-50 focus:border-b-4 focus:border-sky-50" onClick={(e) => handleSelection(e.target.textContent)}>
                    Factures
                </button>
                <button className="px-5 cursor-pointer hover:border-b-4 hover:border-sky-50 focus:border-b-4 focus:border-sky-50" onClick={(e) => handleSelection(e.target.textContent)}>
                    Dettes issues des ventes
                </button>
                <button className="px-5 cursor-pointer hover:border-b-4 hover:border-sky-50 focus:border-b-4 focus:border-sky-50" onClick={(e) => handleSelection(e.target.textContent)}>
                    Emprunts
                </button>
                <button className="px-5 cursor-pointer hover:border-b-4 hover:border-sky-50 focus:border-b-4 focus:border-sky-50" onClick={(e) => handleSelection(e.target.textContent)}>
                    Prêts
                </button>
                <button className="px-5 cursor-pointer hover:border-b-4 hover:border-sky-50 focus:border-b-4 focus:border-sky-50" onClick={(e) => handleSelection(e.target.textContent)}>
                    Avances versées
                </button>

            </div>
            <div className="p-2">
                {data.selection === "Achats" && <>
                    <div className="p-1 m-1 flex justify-end">
                        <input type="text" placeholder="Rechercher les mots clés" className="p-1 border border-sky-950 w-72" onChange={(e) => handleChange("search", e.target.value)} />
                    </div>
                    <div className="flex justify-center">
                        {data.sales.length > 0 ? <table className="w-4/5">
                            <thead>
                                <tr className="bg-sky-950 text-sky-50">
                                    <th className="px-5 border py-1">Id</th>
                                    <th className="px-5 border py-1">Date</th>
                                    <th className="px-5 border py-1">Réf.</th>
                                    <th className="px-5 border py-1">Prix H.T</th>
                                    <th className="px-5 border py-1">Rémise</th>
                                    <th className="px-5 border py-1">Prix T.T.C.</th>
                                    <th className="px-5 border py-1">Acompte</th>
                                    <th className="px-5 border py-1">Reste</th>
                                    <th className="px-5 border py-1">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.sales.map(s => <tr key={s.id}>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.id}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.dateTransaction}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.ref}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.priceHt).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.discount).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.priceTtc).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.payment).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.rest).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1"><FontAwesomeIcon icon={faPrint} className="cursor-pointer" onClick={() => handlePrint("sale", s.id)} /></td>
                                </tr>)}
                            </tbody>
                            <tfoot>
                                <tr className="bg-sky-950 text-sky-50">
                                    <td className="px-5 border py-1 text-center" colSpan="3">TOTAUX</td>
                                    <td className="px-5 border py-1 text-center" >{Number(data?.totalPriceSale.priceHT).toLocaleString()}</td>
                                    <td className="px-5 border py-1 text-center" >{Number(data?.totalPriceSale.discount).toLocaleString()}</td>
                                    <td className="px-5 border py-1 text-center" >{Number(data?.totalPriceSale.priceTTC).toLocaleString()}</td>
                                    <td className="px-5 border py-1 text-center" >{Number(data?.totalPriceSale.payment).toLocaleString()}</td>
                                    <td className="px-5 border py-1 text-center" >{Number(data?.totalPriceSale.rest).toLocaleString()}</td>
                                    <td className="px-5 border py-1 text-center" ></td>
                                </tr>
                            </tfoot>
                        </table> : <p className="text-red-500 font-medium text-center">Aucun achat enregistré</p>}
                    </div>

                </>}
                {data.selection === "Factures" && <>
                    {data.invoices.length > 0 ? <><div className="p-1 m-1 flex justify-end">
                        <input type="text" placeholder="Rechercher les mots clés" className="p-1 border border-sky-950 w-72" onChange={(e) => handleChange("search_invoice", e.target.value)} />
                    </div>
                        <div className="flex justify-center">
                            <table className="w-4/5">
                                <thead>
                                    <tr className="bg-sky-950 text-sky-50">
                                        <th className="px-5 border">Id</th>
                                        <th className="px-5 border">Date</th>
                                        <th className="px-5 border">Réf.</th>
                                        <th className="px-5 border">Montant</th>
                                        <th className="px-5 border">Avance</th>
                                        <th className="px-5 border">Solde</th>
                                        <th className="px-5 border">Statut</th>
                                        <th className="px-5 border">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.invoices.map(s => <tr key={s.id}>
                                        <td className="px-5 border text-center border-sky-950 py-1">{s.id}</td>
                                        <td className="px-5 border text-center border-sky-950 py-1">{s.dateTransaction}</td>
                                        <td className="px-5 border text-center border-sky-950 py-1">{s.ref}</td>
                                        <td className="px-5 border text-center border-sky-950 py-1">{Number(s.amount).toLocaleString()}</td>
                                        <td className="px-5 border text-center border-sky-950 py-1">{Number(s.advance).toLocaleString()}</td>
                                        <td className="px-5 border text-center border-sky-950 py-1">{Number(s.balance).toLocaleString()}</td>
                                        <td className="px-5 border text-center border-sky-950 py-1">{s.status}</td>
                                        <td className="px-5 border text-center border-sky-950 py-1">{cash != "" && s.status === "EN_INSTANCE" ? <FontAwesomeIcon icon={faCoins} className="cursor-pointer" onClick={() => handleOpenPayment(s.id)} /> : "Aucune action dispo."}</td>
                                    </tr>)}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-sky-950 text-sky-50">
                                        <td className="px-5 border py-1 text-center" colSpan="3">TOTAUX</td>
                                        <td className="px-5 border py-1 text-center" >{Number(data?.totalInvoice.amount).toLocaleString()}</td>
                                        <td className="px-5 border py-1 text-center" >{Number(data?.totalInvoice.advance).toLocaleString()}</td>
                                        <td className="px-5 border py-1 text-center" >{Number(data?.totalInvoice.balance).toLocaleString()}</td>
                                        <td colspan="3" className="px-5 border py-1 text-center" ></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </> : <p className="text-red-500 font-medium text-center">Aucune facture enregistrée</p>}

                </>
                }
                {data.selection === "Dettes issues des ventes" && <>{data?.salePayments.length > 0 ? <div className="w-full flex gap-4 justify-center mt-4">
                    <div className="w-2/3">
                        <table className="mb-4 w-full">
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
                    </div>
                    {cash !== "" && <div className="w-1/3 flex flex-col gap-2 items-center border p-2 rounded">
                        <Select label="Moyen paiement *" id="paymentMethod" name="paymentMethod" selectedTitle="Sélectionner un moyen de paiement" data={paymentMethodPayement} ref={selectPaymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)} disabled={data?.disabled} />
                        <Select label="Moyen réception *" id="paymentReceiver" name="paymentReceiver" selectedTitle="Sélectionner un moyen de réception" data={data?.paymentReceiver} ref={selectPaymentReceiver} disabled={data?.paymentMethod === "A_CREDIT" || data?.paymentMethod === "AVANCE_CLIENT" || data?.disabled} />

                        <div className="flex flex-col">

                            <label htmlFor="payment_" className="font-medium">Montant versé</label>
                            <input type="number" id="payment_" placeholder="Montant versé" className="border border-sky-950 rounded text-end shadow-md shadow-sky-950 p-1" ref={inputPayment__} />

                        </div>
                        <Submit onClick={handlePayment}>
                            Enregistrer
                        </Submit>

                    </div>}
                </div> : <p className="text-red-500 font-medium text-center">Aucune dette issue des ventes enregistrée</p>}
                </>
                }
                {data.selection === "Emprunts" && <>
                    {data.borrow.length > 0 ? <div className="flex justify-center">
                        <table className="w-4/5">
                            <thead>
                                <tr className="bg-sky-950 text-sky-50">
                                    <th className="px-5 border">Id</th>
                                    <th className="px-5 border">Réf.</th>
                                    <th className="px-5 border">Montant</th>
                                    <th className="px-5 border">Avance</th>
                                    <th className="px-5 border">Solde</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.borrow.length > 0 && data.borrow.map(s => <tr key={s.id}>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.id}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.ref}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.amount).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.advance).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.balance).toLocaleString()}</td>
                                </tr>)}
                            </tbody>

                        </table>
                    </div> : <p className="text-red-500 font-medium text-center">Aucune emprunt enregistré</p>}

                </>}
                {data.selection === "Prêts" && <>
                    {data.loan.length > 0 ? <div className="flex justify-center">
                        <table className="w-4/5">
                            <thead>
                                <tr className="bg-sky-950 text-sky-50">
                                    <th className="px-5 border">Id</th>
                                    <th className="px-5 border">Réf.</th>
                                    <th className="px-5 border">Montant</th>
                                    <th className="px-5 border">Avance</th>
                                    <th className="px-5 border">Solde</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.loan.length > 0 && data.loan.map(s => <tr key={s.id}>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.id}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.ref}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.amount).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.advance).toLocaleString()}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.balance).toLocaleString()}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div> : <p className="text-red-500 font-medium text-center">Aucun prêt enregistré</p>}

                </>}
                {data.selection === "Avances versées" && <>
                    {data.advances.length > 0 ? <div className="flex justify-center">

                        <table className="w-4/5">
                            <thead>
                                <tr className="bg-sky-950 text-sky-50">
                                    <th className="px-5 border">Id</th>
                                    <th className="px-5 border">Date</th>
                                    <th className="px-5 border">Réf.</th>
                                    <th className="px-5 border">Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.advances.length > 0 && data.advances.map(s => <tr key={s.id}>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.id}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.dateTransaction}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.ref}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{Number(s.amount).toLocaleString()}</td>
                                </tr>)}
                            </tbody>
                            <tfoot>
                                <tr className="bg-sky-950 text-sky-50">
                                    <td className="px-5 border py-1 text-center" colSpan="3">TOTAUX</td>

                                    <td className="px-5 border py-1 text-center" >{Number(data?.totalAdvance.amount).toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                        : <p className="text-red-500 font-medium text-center">Aucune avance enregistrée</p>}

                </>}
            </div>
            {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}

        </Modal >
        <Modal ref={dialog1} title="Sélection du format d'impression" size="h-2/5 ">
            {data.prints.length > 0 ? <div className="flex flex-col items-center justify-center gap-4 mb-4">
                {data.prints.map(p => <button key={p.key} className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
                    <FontAwesomeIcon icon={faPrint} className="me-2"></FontAwesomeIcon>
                    {p.name}
                </button>)}
            </div> : <button className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950 mb-4" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
                IMPRIMANTE_LASER
            </button>}
            <Submit onClick={() => dialog1.current.close()}>Fermer</Submit>
        </Modal>

        <Modal ref={dialog2} size="lg:h-10/14 lg:w-4/15" title="Créer un règlement">
            <CreatePayment />
        </Modal>

    </>

}