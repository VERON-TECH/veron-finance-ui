import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createCash, getAgencyById, getEnterpriseById, queryClient } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"

export default function CreateCash() {
    const user = JSON.parse(localStorage.getItem("user"))
    const inputName = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprise: "",
        agencies: ""
    })


    useEffect(() => {
        let tb = []
        async function get(signal) {
            const enterprise = await getEnterpriseById({ id: user.enterprise, signal })
            const agency = await getAgencyById({ id: user.agency, signal })
            setData(prev => {
                return {
                    ...prev,
                    enterprise: enterprise.slug,
                    agency: agency.slug
                }
            })

        }
        get()
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

        const allData = {
            enterprise,
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




    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <div className="hidden">
                    <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" readOnly />
                    <Input label="Agence *" type="text" defaultValue={data?.agency} name="agency" placeholder="Agence" className="border border-sky-950" readOnly />
                </div>
                <Input label="Nom *" type="text" defaultValue={formState.enteredValue?.name} name="name" placeholder="Nom de l'agence" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />

            </div>

            <Submit>
                Créer
            </Submit>
        </form>


    </>

}