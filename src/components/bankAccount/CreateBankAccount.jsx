import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createBankAccount, getAllBanks, getAllEnterprises } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";

export default function CreateBankAccount() {
    const selectEnterprise = useRef();
    const selectBank = useRef();
    const inputRib = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        banks: [],
        enterprises: []
    })

    useEffect(() => {
        let tbEl = {
            tb: [],
            tb1: []
        }
        async function get() {
            const allBanks = await getAllBanks()
            const allEnterprises = await getAllEnterprises()
            allBanks.forEach(b => {
                tbEl.tb.push({ id: b.id, name: b.name, value: b.slug })
            })
            allEnterprises.forEach(e => {
                tbEl.tb1.push({ id: e.id, name: e.name, value: e.slug })
            })
            setData(prev => {
                return {
                    ...prev,
                    banks: tbEl.tb,
                    enterprises: tbEl.tb1
                }
            })
        }
        get()
    }, [])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const rib = formData.get("rib")
        const bank = formData.get("bank")
        const enterprise = formData.get("enterprise")

        if (!isNotEmpty(rib)) {
            animate(inputRib.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom.")
        }

        if (bank === null) {
            animate(selectBank.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la banque.")
        }

        if (enterprise === null) {
            animate(selectBank.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'entrerprise.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors, enteredValue: {
                    name,
                    rib,
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createBankAccount,
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
            queryClient.cancelQueries(["bankaccounts"])
        }
    })


    function handleBlur(field, value) {

        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "rib") {
            if (!isNotEmpty(value)) {
                animate(inputRib.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }




    return <>

        <form action={formAction} className="rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Select label="Banque *" id="bank" name="bank" selectedTitle="Sélectionner une banque" data={data.banks} ref={selectBank} />
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data.enterprises} ref={selectEnterprise} />
                <Input label="R.I.B. *" type="text" defaultValue={formState.enteredValue?.rib} name="rib" placeholder="Nº du compte bancaire" className="border border-sky-950" onBlur={(event) => handleBlur("rib", event.target.value)} ref={inputRib} />
            </div>

            <Submit>
                Créer
            </Submit>
        </form>


    </>

}