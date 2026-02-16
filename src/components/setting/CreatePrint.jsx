import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createPrint, getAllAgenciesByEnterprise, getAllEnterprises, getEnterpriseBySlug, queryClient } from "../../utils/http";
import Submit from "../../layout/Submit.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { prints } from "../../data/info.js";

export default function CreateStorePrincipal() {
    const selectEnterprise = useRef();
    const selectAgency = useRef();
    const selectPrint = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprises: [],
        agencies: []
    })

    useEffect(() => {
        let tbEl = {
            tb: [],
        }
        async function get() {
            const allEnterprises = await getAllEnterprises()

            allEnterprises.forEach(e => {
                tbEl.tb.push({ key: e.id, name: e.name, value: e.slug })
            })
            setData(prev => {
                return {
                    ...prev,
                    enterprises: tbEl.tb
                }
            })
        }
        get()
    }, [])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const enterprise = formData.get("enterprise")
        const agency = formData.get("agency")
        const typePrint = formData.get("typePrint")



        if (enterprise === null) {
            animate(selectEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'entrerprise.")
        }

        if (agency === null) {
            animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'agence.")
        }

        if (typePrint === null) {
            animate(selectPrint.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner le type d'imprimante.")
        }



        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors,
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createPrint,
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
            queryClient.cancelQueries(["prints"])
        }
    })


    async function handleChange(identifier, value) {
        let tb = []
        if (identifier === "enterprise") {
            async function get(signal) {
                const enterprise = await getEnterpriseBySlug({ slug: value, signal })
                const allAgencies = await getAllAgenciesByEnterprise(enterprise.id)
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
            get()

        }
    }


    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} onChange={(e) => handleChange("enterprise", e.target.value)} />
                <Select label="Agence *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={data?.agencies} ref={selectAgency} />
                <Select label="Type *" id="typePrint" name="typePrint" selectedTitle="Sélectionner une imprimante" data={prints} ref={selectPrint} />
            </div>

            <Submit>
                Appliquer
            </Submit>
        </form>


    </>

}