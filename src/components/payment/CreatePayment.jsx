import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPayement, getAllBankAccount, getAllMobileMoney, getInvoiceById, queryClient } from "../../utils/http";
import Select from "../../layout/Select.jsx"
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import { paymentMethodPayment } from "../../data/info.js";

export default function CreatePayment() {
    const id = useSelector(state => state.modal.value)
    const user = JSON.parse(localStorage.getItem("user"))
    const inputCash = useRef();
    const selectPaymentReceiver = useRef();
    const inputInvoice = useRef();
    const selectPaymentMethod = useRef();
    const inputAmount = useRef();
    const inputBalance = useRef();
    const dispatch = useDispatch();
    const cash = useSelector(state => state.cash)
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        invoice: {},
        paymentReceiver: [],
        paymentMethod: []
    })


    useEffect(() => {
        let tb = []
        if (user.role.includes("ROLE_CAISSIER") && id != "") {
            async function get(signal) {
                inputCash.current.value = cash
                const invoice = await getInvoiceById({ signal, id })
                setData(prev => {
                    return {
                        ...prev,
                        invoice
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

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createPayement,
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
            queryClient.cancelQueries(["agencies"])
        }
    })





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

            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>

}