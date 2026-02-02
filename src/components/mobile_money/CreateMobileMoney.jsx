import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createMobileMoney, getAllEnterprises, getAllOperators, queryClient } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { countries } from "../../data/info.js";

export default function CreateMobileMoney() {
    const selectEnterprise = useRef();
    const selectOperator = useRef();
    const selectCountry = useRef();
    const inputPhone = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        operators: [],
        enterprises: []
    })

    useEffect(() => {
        let tbEl = {
            tb: [],
            tb1: []
        }
        async function get() {
            const allOperators = await getAllOperators()
            const allEnterprises = await getAllEnterprises()
            allOperators.forEach(o => {
                tbEl.tb.push({ id: o.id, name: o.name, value: o.slug })
            })
            allEnterprises.forEach(e => {
                tbEl.tb1.push({ id: e.id, name: e.name, value: e.slug })
            })
            setData(prev => {
                return {
                    ...prev,
                    operators: tbEl.tb,
                    enterprises: tbEl.tb1
                }
            })
        }
        get()
    }, [])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const country = formData.get("country")
        const operator = formData.get("operator")
        const enterprise = formData.get("enterprise")
        const phone = formData.get("phone")

        if (!isNotEmpty(phone)) {
            animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nº de téléphone.")
        }

        if (operator === null) {
            animate(selectOperator.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'opérateur.")
        }

        if (country === null) {
            animate(selectCountry.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner le pays.")
        }

        if (enterprise === null) {
            animate(selectEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'entrerprise.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors, enteredValue: {
                    phone,
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createMobileMoney,
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
            queryClient.cancelQueries(["mobilemoney"])
        }
    })


    function handleBlur(field, value) {

        if (field === "phone") {
            if (!isNotEmpty(value)) {
                animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }


    }




    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Select label="Pays *" id="country" name="country" selectedTitle="Sélectionner un pays" data={countries} ref={selectCountry} />
                <Select label="Opérateur *" id="operator" name="operator" selectedTitle="Sélectionner un opérateur" data={data.operators} ref={selectOperator} />
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data.enterprises} ref={selectEnterprise} />
                <Input label="Tél. *" type="text" defaultValue={formState.enteredValue?.phone} name="phone" placeholder="Nº de téléphone" className="border border-sky-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
            </div>

            <Submit>
                Créer
            </Submit>
        </form>


    </>

}