import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createStore, getAgencyById, getEnterpriseById, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";

export default function CreateStore() {

    const user = JSON.parse(localStorage.getItem("user"));

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

        if (user.eneterprise > 0 && user.agency > 0) {
            let tbEl = {
                tb: [],
                tb1: []
            }
            async function get(signal) {
                const allAgencies = await getAgencyById({ id: user.agency, signal })
                const allEnterprises = await getEnterpriseById({ id: user.enterprise, signal })

                tbEl.tb.push({ key: allAgencies.id, name: allAgencies.name, value: allAgencies.slug })
                tbEl.tb1.push({ key: allEnterprises.id, name: allEnterprises.name, value: allEnterprises.slug })

                setData(prev => {
                    return {
                        ...prev,
                        agencies: tbEl.tb,
                        enterprises: tbEl.tb1
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
        const name = formData.get("name")


        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom du magasin.")
        }

        if (agency === null) {
            animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'agence'.")
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
                    name,
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createStore,
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
            queryClient.cancelQueries(["services"])
        }
    })


    function handleBlur(field, value) {

        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

    }

    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} />
                <Select label="Agence *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={data?.agencies} ref={selectAgency} />
                <Input label="Nom *" type="text" defaultValue={formState.enteredValue?.name} name="name" placeholder="Nom du magasin" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
            </div>
            <Submit>
                Créer
            </Submit>
        </form>


    </>

}