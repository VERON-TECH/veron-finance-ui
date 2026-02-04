import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getBudgetById, getEnterpriseById, getSpentById, queryClient, updateBudget } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import { modalActions } from "../../store/modalSlice.js";
import Modal from "../../layout/Modal.jsx";
import ConfirmationDelete from "../global/ConfirmationDelete.jsx";

export default function UpdateBudget() {
    const id = useSelector(state => state.modal.value)
    const user = JSON.parse(localStorage.getItem("user"))
    const inputStartDate = useRef();
    const inputEndDate = useRef();
    const inputEnterprise = useRef();
    const inputAgency = useRef();
    const inputSpent = useRef();
    const inputBudget = useRef();
    const dialog = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        budget: {},
        enterprise: "",
        agency: "",
        spent: ""
    })



    useEffect(() => {
        if (id !== "" && id !== undefined) {

            async function get(signal) {
                const budget = await getBudgetById({ id, signal })
                const enterprise = await getEnterpriseById({ id: budget.enterprise, signal })
                const agency = await getAgencyById({ id: budget.agency, signal })
                const spent = await getSpentById({ id: budget.spent, signal })
                setData(prev => {
                    return {
                        ...prev,
                        enterprise: enterprise.slug,
                        agency: agency.slug,
                        spent: spent.slug,
                        budget
                    }
                })
            }
            get()
        }


    }, [id])

    async function handleSubmit(prevState, formData, signal) {
        let errors = [];

        const allData = Object.fromEntries(formData.entries())
        const enterprise = formData.get("enterprise")
        const agency = formData.get("agency")
        const spent = formData.get("spent")
        const startDate = formData.get("startDate")
        const endDate = formData.get("endDate")
        const budget = formData.get("budget")


        if (!isNotEmpty(enterprise)) {
            animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner l'entreprise.")
        }

        if (!isNotEmpty(agency)) {
            animate(inputAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner l'agence.")
        }

        if (!isNotEmpty(spent)) {
            animate(inputSpent.current, { x: [0, 15, 0] }, { bounce: 0.75 })
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
                errors
            }
        }

        const budgetEl = await getBudgetById({ id, signal })

        mutate({ period: budgetEl.period, budgetDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateBudget,
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

    async function handleValidate() {
        dispatch(modalActions.updateValue(id))
        dialog.current.open()
    }

    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" ref={inputEnterprise} />
                <Input label="Agence *" type="text" defaultValue={data?.agency} name="agency" placeholder="Agence" className="border border-sky-950" ref={inputAgency} />
                <Input label="Dépense *" type="text" defaultValue={data?.spent} name="spent" placeholder="Dépense" className="border border-sky-950" ref={inputSpent} />
                <Input label="Date de départ *" type="date" defaultValue={data?.budget.startDate} name="startDate" placeholder="Date de début" className="border border-sky-950" onBlur={(event) => handleBlur("startDate", event.target.value)} ref={inputStartDate} />
                <Input label="Date de fin *" type="date" defaultValue={data?.budget.endDate} name="endDate" placeholder="Date de fin" className="border border-sky-950" onBlur={(event) => handleBlur("endDate", event.target.value)} ref={inputEndDate} />
                <Input label="Montant *" type="number" defaultValue={data?.budget.budget} name="budget" placeholder="Montant de la dépense" className="border border-sky-950" onBlur={(event) => handleBlur("budget", event.target.value)} ref={inputBudget} />
            </div>
            <Submit>
                Enregistrer
            </Submit>
        </form>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            {user.role.includes("ROLE_ADMIN") && data?.budget.statusBudget === "EN_ATTENTE_DE_VALIDATION" ? <Submit onClick={() => handleValidate()}>
                Valider
            </Submit> : user.role.includes("ROLE_ADMIN") && data?.budget.statusBudget === "ACTIVE" ? <Submit disabled={true}>
                Validé
            </Submit> : user.role.includes("ROLE_ADMIN") && data?.budget.statusBudget === "INACTIVE" ? <Submit disabled={true}>
                Inactif
            </Submit> : undefined}
        </div>
        <Modal ref={dialog} size="lg:h-3/15 lg:w-5/16" title="Valider une prévision">
            <ConfirmationDelete authorize="validateBudget" />
        </Modal>


    </>

}