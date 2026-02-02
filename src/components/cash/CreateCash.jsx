import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createCash, getAllAgenciesByEnterprise, getAllEnterprises, getEnterpriseById, queryClient } from "../../utils/http";
import Select from "../../layout/Select.jsx"
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"

export default function CreateCash() {
    const selectEnterprise = useRef();
    const selectAgency = useRef();
    const inputName = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprises: [],
        agencies: []
    })


    useEffect(() => {
        let tb = []
        let tb1 = []
        async function getAll() {
            const allEnterprises = await getAllEnterprises()
            allEnterprises.forEach(e => {
                tb.push({ key: e.id, name: e.name, value: e.id })
            })
            setData(prev => {
                return {
                    ...prev,
                    enterprises: tb
                }
            })

        }
        getAll()
    }, [])


    async function handleSubmit(prevState, formData, signal) {
        let errors = [];


        const name = formData.get("name")
        const enterprise = formData.get("enterprise")
        const agency = formData.get("agency")



        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom.")
        }


        if (agency === null) {
            animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner l'agence.")
        }

        if (enterprise === null) {
            animate(selectEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner l'entreprise.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors, enteredValue: {
                    name,
                }
            }
        }

        const enterpriseItem = await getEnterpriseById({ id: enterprise, signal })
        const allData = {
            enterprise: enterpriseItem.slug,
            agency,
            name
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createCash,
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
            queryClient.cancelQueries(["cashes"])
        }
    })





    function handleBlur(field, value) {

        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }


    async function handleChange(enterprise) {
        let tb = []
        const allAgencies = await getAllAgenciesByEnterprise(enterprise);
        allAgencies.forEach(a => {
            tb.push({ key: a.id, name: a.name, value: a.slug })
        })
        setData(prev => {
            return {
                ...prev,
                agencies: tb
            }
        })
    }


    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data.enterprises} ref={selectEnterprise} onChange={(e) => handleChange(e.target.value)} />
                <Select label="Agences *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={data.agencies} ref={selectAgency} />
                <Input label="Nom *" type="text" defaultValue={formState.enteredValue?.name} name="name" placeholder="Nom de l'agence" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />

            </div>

            <Submit>
                Créer
            </Submit>
        </form>


    </>

}