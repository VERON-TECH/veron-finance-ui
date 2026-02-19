
import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convert, getAgencyById, getAllInvoiceByCustomer, getAllPrints, getAllSalePaymentsByCustomer, getAllSalesByCustomer, getCashById, getCustomerById, getEnterpriseById, getSaleById, queryClient, updateCustomer } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { genders } from "../../data/info.js";
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
        typePrint: "sale"
    })

    useEffect(() => {
        if (id != "") {
            async function get(signal) {
                let tb = []
                let tb1 = []
                let tb2 = []
                const customer = await getCustomerById({ signal, id })
                const allSales = await getAllSalesByCustomer({ signal, customer: id });
                const allInvoices = await getAllInvoiceByCustomer({ signal, customer: id })
                const allSalePayments = await getAllSalePaymentsByCustomer({ signal, customer: id })
                const enterprise_ = await getEnterpriseById({ id: user.enterprise, signal })
                allSales.forEach(s => {
                    tb.push({ id: s.id, dateTransaction: s.dateTransaction, ref: s.ref, priceHt: s.priceHt, discount: s.discount, priceTtc: s.priceTtc, payment: s.payment, rest: s.rest })
                })

                allInvoices.forEach(s => {
                    tb2.push({ id: s.id, dateTransaction: s.dateTransaction, ref: s.ref, amount: s.amount, advance: s.advance, balance: s.balance, status: s.statusInvoice })
                })

                allSalePayments.forEach(s => {
                    tb2.push({ id: s.id, sale: s.sale, ref: s.ref, amount: s.amount, advance: s.advance, balance: s.balance, status: s.statusInvoice })
                })
                const allPrints = await getAllPrints({ signal, enterprise: user.enterprise, agency: user.agency })

                allPrints.forEach(p => {
                    if (p.status === "ACTIVE") {
                        tb1.push({ key: p.id, name: p.type, value: p.type })
                    }
                })

                setData(prev => {
                    return { ...prev, enterprise: enterprise_.slug, customer, sales: tb, prints: tb1, invoices: tb2 }
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
        const phone2 = formData.get("phone2")
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
            navigate("/print-sale")
        }

    }

    function handleOpenPayment(value) {
        dispatch(modalActions.updateValue(value))
        dialog2.current.open()
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
        <div className="absolute bottom-5 right-5">
            <Submit onClick={handleModal}>
                Listing des opérations
            </Submit>
        </div>

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
                        <table className="w-4/5">
                            <thead>
                                <tr className="bg-sky-950 text-sky-50">
                                    <th className="px-5 border">Id</th>
                                    <th className="px-5 border">Date</th>
                                    <th className="px-5 border">Réf.</th>
                                    <th className="px-5 border">Prix H.T</th>
                                    <th className="px-5 border">Rémise</th>
                                    <th className="px-5 border">Prix T.T.C.</th>
                                    <th className="px-5 border">Acompte</th>
                                    <th className="px-5 border">Reste</th>
                                    <th className="px-5 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.sales.length > 0 && data.sales.map(s => <tr key={s.id}>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.id}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.dateTransaction}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.ref}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.priceHt}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.discount}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.priceTtc}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.payment}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.rest}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1"><FontAwesomeIcon icon={faPrint} className="cursor-pointer" onClick={() => handlePrint("sale", s.id)} /></td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>

                </>}
                {data.selection === "Factures" && <>
                    <div className="p-1 m-1 flex justify-end">
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
                                {data.invoices.length > 0 && data.invoices.map(s => <tr key={s.id}>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.id}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.dateTransaction}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.ref}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.amount}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.advance}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.balance}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{s.status}</td>
                                    <td className="px-5 border text-center border-sky-950 py-1">{cash != "" && s.status === "EN_INSTANCE" ? <FontAwesomeIcon icon={faCoins} className="cursor-pointer" onClick={() => handleOpenPayment(s.id)} /> : "Aucune action dispo."}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>

                </>}
                {data.selection === "Dettes issues des ventes" && data?.salePayments.length > 0 && <div className="flex gap-4 justify-center mt-4"><table className="w-2/3 mb-4">
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
                {data.selection === "Emprunts" && <h1>Hello Emprunt</h1>}
                {data.selection === "Prêts" && <h1>Hello Prêt</h1>}
                {data.selection === "Avances versées" && <h1>Hello Avance</h1>}
            </div>
            {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}

        </Modal>
        <Modal ref={dialog1} title="Sélection du format d'impression" size="h-2/5 ">
            {data.prints.length > 0 ? <div className="flex flex-col items-center justify-center gap-4 mb-4">
                {data.prints.map(p => <button key={p.id} className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
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