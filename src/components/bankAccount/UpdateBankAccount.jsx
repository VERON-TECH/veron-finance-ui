import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBankAccountById, getBankById, getEnterpriseById, updateBankAccount } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"

export default function UpdateBankAccount() {
    const inputEnterprise = useRef();
    const inputBank = useRef();
    const inputRib = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({
        enterprise: "",
        bank: "",
        rib: ""
    })
    const id = useSelector(state => state.modal.value)
    useEffect(() => {
        async function get(signal) {
            if (user.role.includes("ROLE_ADMIN") && id != "" || user.role.includes("ROLE_COMPTABLE") && id != "") {
                const bankAccount = await getBankAccountById({ id, signal })
                const enterprise = await getEnterpriseById({ id: bankAccount.enterprise, signal })
                const bank = await getBankById({ id: bankAccount.bank, signal })
                setData(prev => {
                    return {
                        ...prev,
                        enterprise: enterprise.slug,
                        bank: bank.slug,
                        rib: bankAccount.rib,
                    }
                })
            }
        }
        get()

    }, [id])



    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        const allData = Object.fromEntries(formData.entries())
        const rib = formData.get("rib")
        const enterprise = formData.get("enterprise")
        const bank = formData.get("bank")


        if (!isNotEmpty(rib)) {
            animate(inputRib.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le R.I.B.")
        }


        if (!isNotEmpty(bank)) {
            animate(inputBank.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner la banque.")
        }

        if (!isNotEmpty(enterprise)) {
            animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner l'entreprise.")
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
        const bankAccount = await getBankAccountById({ id, signal })


        mutate({ slug: bankAccount.slug, bankAccountDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateBankAccount,
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

        if (field === "rib") {
            if (!isNotEmpty(value)) {
                animate(inputRib.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "enterprise") {
            if (!isNotEmpty(value)) {
                animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "bank") {
            if (!isNotEmpty(value)) {
                animate(inputBank.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }

    return <>

        <form action={formAction} className="rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Banque *" type="text" defaultValue={data?.bank} name="bank" placeholder="Nom de la banque" className="border border-sky-950" onBlur={(event) => handleBlur("bank", event.target.value)} ref={inputBank} readOnly />
                <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Nom de l'entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("enterprise", event.target.value)} ref={inputEnterprise} readOnly />
                <Input label="R.I.B. *" type="text" defaultValue={data?.rib} name="rib" placeholder="Nº du compte bancaire" className="border border-sky-950" onBlur={(event) => handleBlur("rib", event.target.value)} ref={inputRib} />
            </div>

            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>

}