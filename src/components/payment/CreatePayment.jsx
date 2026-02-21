import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convert, createPayement, getAgencyById, getAllBankAccount, getAllMobileMoney, getAllPrints, getCashBySlug, getCustomerById, getEnterpriseById, getInvoiceById, getSaleById, queryClient } from "../../utils/http";
import Select from "../../layout/Select.jsx"
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import { paymentMethodPayment } from "../../data/info.js";
import { identifierMenuActions } from "../../store/identifierSlice.js";
import Modal from "../../layout/Modal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { printActions } from "../../store/print.js";
import { useNavigate } from "react-router-dom";

export default function CreatePayment() {
    const id = useSelector(state => state.modal.value)
    const user = JSON.parse(localStorage.getItem("user"))
    const inputCash = useRef();
    const selectPaymentReceiver = useRef();
    const inputInvoice = useRef();
    const selectPaymentMethod = useRef();
    const inputAmount = useRef();
    const inputBalance = useRef();
    const dialog = useRef()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const cash = useSelector(state => state.cash)
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        invoice: {},
        paymentReceiver: [],
        paymentMethod: [],
        prints: [],
        typePrint: "payment"
    })


    useEffect(() => {
        if (user.role.includes("ROLE_CAISSIER") && id != "") {
            async function get(signal) {
                inputCash.current.value = cash
                const invoice = await getInvoiceById({ signal, id })
                const allPrints = await getAllPrints({ signal, enterprise: user.enterprise, agency: user.agency })

                let prints = []
                allPrints.forEach(p => {
                    prints.push({ key: p.id, name: p.type, value: p.type })
                })

                setData(prev => {
                    return {
                        ...prev,
                        invoice,
                        prints,
                    }
                })


            }
            get()
        }

    }, [id, cash])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];


        const cash = formData.get("cash")
        const paymentReceiver = formData.get("paymentReceiver")
        const invoice = formData.get("invoice")
        const paymentMethod = formData.get("paymentMethod")
        const amount = formData.get("amount")



        if (!isNotEmpty(cash)) {
            animate(inputCash.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la caisse.")
        }


        if (paymentReceiver == null) {
            animate(selectPaymentReceiver.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner le moyen de réception.")
        }

        if (!isNotEmpty(invoice)) {
            animate(inputInvoice.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la facture.")
        }



        if (paymentMethod === null) {
            animate(selectPaymentMethod.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner le moyen de paiement.")
        }


        if (amount <= 0) {
            animate(inputAmount.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner un montant valide.")
        }

        if (amount > Number(inputBalance.current.value)) {
            animate(inputAmount.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            animate(inputBalance.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Le montant est supérieur au soldde de la facture.")
        }




        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors, enteredValue: {
                    cash,
                    invoice,
                    amount,
                }
            }
        }

        const paymentDto = {
            cash,
            paymentReceiver,
            invoice,
            paymentMethod,
            amount
        }
        const controller = new AbortController();
        const signal = controller.signal;

        const cash_ = await getCashBySlug({ slug: cash, signal })
        const invoice_ = await getInvoiceById({ signal, id })
        const enterprise = await getEnterpriseById({ id: invoice_.enterprise, signal })
        const agency = await getAgencyById({ id, agency: invoice_.agency })
        const sale = await getSaleById({ signal, id: invoice_.sale })
        const customer = await getCustomerById({ signal, id: sale.customer })
        const amountLetter = await convert(Number(amount))

        const responseData = await createPayement(allData)
        const state = responseHttp(responseData);
        if (state) {
            dispatch(noteActions.error(true))
        } else {
            dispatch(noteActions.error(false))
            const printPayment = {
                enterprise,
                agency,
                date: new Date().toLocaleDateString(),
                time: new Date().getTime().toLocaleString(),
                invoice: invoice_,
                amount,
                cash: cash_,
                amountLetter,
                customer,
            }
            dispatch(printActions.getPrint(printPayment))
            dialog.current.open()

        }
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.sendData(responseData))

        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })








    function handleBlur(field, value) {

        if (field === "amount") {
            if (amount <= 0) {
                animate(inputAmount.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }

            if (amount > Number(inputBalance.current.value)) {
                animate(inputAmount.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                animate(inputBalance.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }

    async function handleChange(identifier, value, signal) {
        let tbEl = {
            tb: []
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


    function handleSelectionPrint(value) {
        dispatch(identifierMenuActions.updatePrint({ print: value }))
        if (data?.typePrint === "payment") {
            navigate("/print-payment")
        }
    }



    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Facture *" type="text" name="invoice" placeholder="facture" defaultValue={data?.invoice.slug} className="border border-sky-950" ref={inputInvoice} readOnly />
                <Input label="Caisse *" type="text" name="cash" placeholder="Caisse" className="border border-sky-950" ref={inputCash} readOnly />
                <Select label="Moyen paiement *" id="paymentMethod" name="paymentMethod" selectedTitle="Sélectionner un moyen de paiement" data={paymentMethodPayment} ref={selectPaymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)} />
                <Select label="Moyen réception *" id="paymentReceiver" name="paymentReceiver" selectedTitle="Sélectionner un moyen de réception" data={data?.paymentReceiver} ref={selectPaymentReceiver} />
                <Input label="Montant restant *" id="balance" type="number" defaultValue={data?.invoice.balance} name="balance" placeholder="Solde" className="border border-sky-950" ref={inputBalance} readOnly />
                <Input label="Montant *" id="amount" type="number" name="amount" placeholder="montant" className="border border-sky-950" onBlur={() => handleBlur("amount")} ref={inputAmount} />
            </div>

            {cash !== "" ? <Submit>
                Enregistrer
            </Submit> : <p className="text-red-500 text-center">Aucune caisse rattachée</p>}
        </form>

        <Modal ref={dialog} title="Sélection du format d'impression" size="h-2/5 ">
            {data?.prints.length > 0 ? <div className="flex flex-col items-center justify-center gap-4 mb-4">
                {data?.prints.map(p => <button key={p.key} className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
                    <FontAwesomeIcon icon={faPrint} className="me-2"></FontAwesomeIcon>
                    {p.name}
                </button>)}
            </div> : <button className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950 mb-4" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
                IMPRIMANTE_LASER
            </button>}
            <Submit onClick={() => dialog.current.close()}>Fermer</Submit>
        </Modal>


    </>

}