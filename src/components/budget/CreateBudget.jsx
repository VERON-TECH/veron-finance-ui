import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createBudget, getAgencyById, getAllSpents, getEnterpriseById, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";

export default function CreateBudget() {
    const user = JSON.parse(localStorage.getItem("user"))
    const inputStartDate = useRef();
    const inputEndDate = useRef();
    const selectEnterprise = useRef();
    const selectAgency = useRef();
    const selectSpent = useRef();
    const inputBudget = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprises: [],
        agencies: [],
        spend: []
    })



    useEffect(() => {
        if (user?.role.includes("ROLE_COMPTABLE")) {
            let tbEl = {
                tb: [],
                tb1: [],
                tb2: [],
            }
            async function get(signal) {
                const allEnterprises = await getEnterpriseById({ id: user.enterprise, signal })
                const allAgencies = await getAgencyById({ id: user.agency, signal })
                const allSpend = await getAllSpents()
                tbEl.tb.push({ key: allEnterprises.id, name: allEnterprises.name, value: allEnterprises.slug })

                tbEl.tb1.push({ key: allAgencies.id, name: allAgencies.name, value: allAgencies.slug })

                allSpend.forEach(s => {
                    tbEl.tb2.push({ key: s.id, name: s.name, value: s.slug })
                })


                setData(prev => {
                    return {
                        ...prev,
                        enterprises: tbEl.tb,
                        agencies: tbEl.tb1,
                        spend: tbEl.tb2,
                    }
                })
            }
            get()
        }


    }, [])

    async function handleSubmit(prevState, formData) {



        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const enterprise = formData.get("enterprise")
        const agency = formData.get("agency")
        const spent = formData.get("spent")
        const startDate = formData.get("startDate")
        const endDate = formData.get("endDate")
        const budget = formData.get("budget")


        if (enterprise === null) {
            animate(selectEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner l'entreprise.")
        }

        if (agency === null) {
            animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner l'agence.")
        }

        if (spent === null) {
            animate(selectSpent.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner la dépense.")
        }

        if (startDate === null) {
            animate(inputStartDate.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner la date de départ.")
        }

        if (endDate === null) {
            animate(inputEndDate.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner la date de fin.")
        }

        if (budget <= 0) {
            animate(inputBudget.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Le montant de la prévision doit être supérieur à 0.")
        }



        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors, enteredValue: {
                    budget,
                    startDate,
                    endDate
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createBudget,
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
            queryClient.cancelQueries(["budgets"])
        }
    })


    function handleBlur(field, value) {

        if (field === "budget") {
            if (!isNotEmpty(value)) {
                animate(inputBudget.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "startDate") {
            if (!isNotEmpty(value)) {
                animate(inputStartDate.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "endDate") {
            if (!isNotEmpty(value)) {
                animate(inputEndDate.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

    }

    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} />
                <Select label="Agence *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={data?.agencies} ref={selectAgency} />
                <Select label="Dépense *" id="spent" name="spent" selectedTitle="Sélectionner une dépense" data={data?.spend} ref={selectSpent} />
                <Input label="Date de départ *" type="date" defaultValue={formState.enteredValue?.startDate} name="startDate" placeholder="Date de début" className="border border-sky-950" onBlur={(event) => handleBlur("startDate", event.target.value)} ref={inputStartDate} />
                <Input label="Date de fin *" type="date" defaultValue={formState.enteredValue?.endDate} name="endDate" placeholder="Date de fin" className="border border-sky-950" onBlur={(event) => handleBlur("endDate", event.target.value)} ref={inputEndDate} />
                <Input label="Montant *" type="number" defaultValue={formState.enteredValue?.budget} name="budget" placeholder="Montant de la dépense" className="border border-sky-950" onBlur={(event) => handleBlur("budget", event.target.value)} ref={inputBudget} />
            </div>
            <Submit>
                Créer
            </Submit>
        </form>


    </>

}